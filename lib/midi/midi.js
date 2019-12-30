import {Hex} from 'lib/midi/util'

import {setErrorAction, setMidiAction, setPortsAction, setStatusAction} from 'lib/store/midi'
import {clock} from 'lib/midi/clock'
import arduino from 'lib/midi/arduino'
import drums from 'lib/midi/drums'
import sequencer from 'lib/midi/sequencer'
import router from 'lib/midi/router'

let midiAccess = null
let store
let listeners = []

function onMIDISuccess (access) {
	console.log('MIDI System Initialized')
	midiAccess = access
	store.dispatch(setMidiAction(access))
	refreshDevices(access)
}

function onMIDIFailure (msg) {
	console.error('Failed to get MIDI access', msg)
	store.dispatch(setErrorAction('Failed to initialize MIDI: ' + msg))
}

function refreshDevices (midiAccess) {
	let inputs = []
	let outputs = []

	let iter = midiAccess.inputs.values()
	for (let i = iter.next(); i && !i.done; i = iter.next()) {
		i.value.hex = Hex(i.value.id)
		i.value.onmidimessage = listener
		inputs.push(i.value)
	}

	iter = midiAccess.outputs.values()
	for (let i = iter.next(); i && !i.done; i = iter.next()) {
		i.value.hex = Hex(i.value.id)
		outputs.push(i.value)
	}

	store.dispatch(setPortsAction(inputs, outputs))
	if (outputs.length === 0) {
		store.dispatch(setErrorAction('Can not find any MIDI ports. Make sure you have atleast one MIDI device connected to your computer.'))
		return
	}
	store.dispatch(setStatusAction(1))
}

// listener is our global midi input listener
// parses and dispatches msgs to separate listeners
function listener (event) {
	let status = parseInt(event.data[0], 10)

	let channel = 0
	if (status >= 0x80 && status < 0xf0) {
		channel = status & 15
	}

	let ev = {
		timestamp: event.timeStamp,
		data: event.data,
		source: event.target,
		status: status,
		channel: channel
	}

	if (status >= 0xf8) {
		clock.MidiIN(ev)
	}
	if (status === 0xf0) {
		arduino.Sysex(ev)
	}
	router.MidiIN(ev)
	listeners.forEach((f) => { f(ev) })
}

export function AddListener (f) {
	listeners.push(f)
}

export function RemoveListener (f) {
	let i = listeners.indexOf(f)
	if (i > -1) {
		listeners.splice(i, 1)
	}
}

export function RefreshMidi () {
	if (midiAccess !== null) {
		let iter = midiAccess.inputs.values()
		for (let i = iter.next(); i && !i.done; i = iter.next()) {
			i.value.onmidimessage = null
		}
	}

	if (navigator.requestMIDIAccess === undefined) {
		store.dispatch(setErrorAction('Unsupported Browser'))
		return
	}

	navigator.requestMIDIAccess({sysex: true}).then(onMIDISuccess, onMIDIFailure)
}

export function MidiOUTAll (bytes) {
	midiAccess.outputs.forEach((output) => {
		output.send(bytes)
	})
}

export function MidiOUT (device, bytes) {
	device.send(bytes)
}

// Forwards to all devices except name
export function MidiOUTForward (name, bytes) {
	midiAccess.outputs.forEach((output) => {
		if (output.name !== name) {
			output.send(bytes)
		}
	})
}

export function InitMIDI (newStore) {
	store = newStore
	RefreshMidi()
	clock.Init(store)
	arduino.Init(store)
	router.Init(store)
	drums.Init(store)
	sequencer.Init(store)
}
