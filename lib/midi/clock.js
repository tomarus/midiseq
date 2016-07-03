import {setBPMAction, setInputBPMAction, setPlayingAction, setSyncModeAction} from 'lib/store/midi'

import {MidiOUT} from 'lib/midi/midi'
import drums from 'lib/midi/drums'
import sequencer from 'lib/midi/sequencer'

export let SyncMode = {
	Send: 1,
	Receive: 2,
	Forward: 3,
	Ignore: 4
}

let outputs
let store

let listeners = []
let interval = 20.0
let ihandler // interval handler

// for input bpm calculation
let ticksReceived = 0
let lastTickReceived

// updated to redux store
let syncmode = SyncMode.Forward // default MUST match store/midi.js
let playing

// redux

function select (state) {
	outputs = state.midi.outputs
}

function Init (newstore) {
	store = newstore
	store.subscribe(() => {
		select(store.getState())
	})
}

// internal functions

function sysout (bytes) {
	outputs.forEach((out) => {
		if (out.sysOut) {
			MidiOUT(out, bytes)
		}
	})
}

function clockout (bytes) {
	outputs.forEach((out) => {
		if (out.clockOut) {
			MidiOUT(out, bytes)
		}
	})
}

function startInterval (interval) {
	stopInterval()
	ihandler = setInterval(handleTick, interval)
}

function stopInterval () {
	clearInterval(ihandler)
}

// called from either midi in, or from timer.
function handleTick () {
	if (syncmode === SyncMode.Send) {
		clockout([0xf8])
	}
	drums.Tick()
	sequencer.Tick()
	listeners.forEach((f) => { if (f.Tick !== undefined) f.Tick() })
}

function handlePlay () {
	drums.Play()
	sequencer.Play()
	listeners.forEach((f) => { if (f.Play !== undefined) f.Play() })
	playing = true
	store.dispatch(setPlayingAction(playing))
}

function handleContinue () {
	drums.Play()
	sequencer.Play()
	listeners.forEach((f) => { if (f.Continue !== undefined) f.Continue() })
	playing = true
	store.dispatch(setPlayingAction(playing))
}

function handleStop () {
	drums.Stop()
	sequencer.Stop()
	listeners.forEach((f) => { if (f.Stop !== undefined) f.Stop() })
	playing = false
	store.dispatch(setPlayingAction(playing))
}

function calcBPM () {
	ticksReceived++
	if (ticksReceived % 24 === 0) {
		let now = window.performance.now()
		if (lastTickReceived === undefined) {
			lastTickReceived = now
			return
		}
		let t = now - lastTickReceived
		lastTickReceived = now
		let bpm = 60000.0 / t
		store.dispatch(setInputBPMAction(bpm))
	}
}

// Always received from midi listener for system messages
function MidiIN (msg) {
	switch (msg.status) {
	case 0xf8: // tick
		if (syncmode === SyncMode.Forward) {
			clockout([0xf8])
		}
		if ((syncmode === SyncMode.Receive || syncmode === SyncMode.Forward) && playing) {
			handleTick()
		}
		calcBPM()
		break
	case 0xfa: // play
		if (syncmode !== SyncMode.Ignore) {
			Play()
		}
		break
	case 0xfb: // continue
		if (syncmode !== SyncMode.Ignore) {
			Continue()
		}
		break
	case 0xfc: // stop
		if (syncmode !== SyncMode.Ignore) {
			Stop()
		}
		break
	case 0xfe: // active sensing
		break
	case 0xff: // system reset
		break
	default:
		console.error('Clock received unhandled msg ', msg)
	}
}

// exported functions (at the bottom) using e.g. clock.Play()

function Play () {
	if (syncmode === SyncMode.Send || syncmode === SyncMode.Forward) {
		sysout([0xfa])
	}
	if (syncmode === SyncMode.Send || syncmode === SyncMode.Ignore) {
		startInterval(interval)
	}
	handlePlay()
}

function Continue (msg) {
	if (syncmode === SyncMode.Send || syncmode === SyncMode.Forward) {
		sysout([0xfb])
	}
	handleContinue()
}

function Stop (msg) {
	if (syncmode === SyncMode.Send || syncmode === SyncMode.Forward) {
		sysout([0xfc])
	}
	if (syncmode === SyncMode.Send || syncmode === SyncMode.Ignore) {
		stopInterval(interval)
	}
	handleStop()
}

function AddListener (ref) {
	listeners.push(ref)
}

function RemoveListener (ref) {
	let i = listeners.indexOf(ref)
	if (i > -1) {
		listeners.splice(i, 1)
	}
}

function SetBPM (bpm) {
	interval = 60000.0 / bpm / 24.0
	store.dispatch(setBPMAction(bpm))
	if (playing) startInterval(interval)
}

function SetSyncMode (mode) {
	Stop()
	syncmode = mode
	store.dispatch(setSyncModeAction(mode))
}

export var clock = {Init, Play, Continue, Stop, AddListener, RemoveListener, MidiIN, SetBPM, SetSyncMode, SyncMode}
