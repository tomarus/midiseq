import {clock} from 'lib/midi/clock'
import {RefreshMidi} from 'lib/midi/midi'

const REFRESH      = 'midi/REFRESH'
const STATUS       = 'midi/STATUS'
const ERROR        = 'midi/ERROR'
const CLOCKOUT     = 'midi/CLOCKOUT'
const SYSOUT       = 'midi/SYSOUT'
const SET_BPM      = 'midi/SET_BPM'

const SET_MIDI     = 'midi/SET_DEVICES'
const SET_PORTS    = 'midi/SET_PORTS'
const SET_INBPM    = 'midi/SET_INBPM'
const SET_PLAYING  = 'midi/SET_PLAYING'
const SET_SYNCMODE = 'midi/SET_SYNCMODE'

let initialState = {
	status: 0,
	error: '',
	midi: null,
	inbpm: 0, // received/calculated bpm
	inputs: [],
	outputs: [],
	// clock stuff
	playing: false,
	bpm: 125,
	syncMode: clock.SyncMode.Forward
}

export const refreshMidiAction = () => ({
	type: REFRESH
})

export const setStatusAction = (status) => ({
	type: STATUS, status
})

export const setErrorAction = (error) => ({
	type: ERROR, error
})

export const setMidiAction = (midi) => ({
	type: SET_MIDI, midi
})

export const clockOutAction = (index, clockOut) => ({
	type: CLOCKOUT, index, clockOut
})

export const sysOutAction = (index, sysOut) => ({
	type: SYSOUT, index, sysOut
})

export const setBPMAction = (bpm) => ({
	type: SET_BPM, bpm
})

export const setInputBPMAction = (bpm) => ({
	type: SET_INBPM, bpm
})

export const setSyncModeAction = (syncMode) => ({
	type: SET_SYNCMODE, syncMode
})

export const setPortsAction = (inputs, outputs) => ({
	type: SET_PORTS, inputs, outputs
})

export const setPlayingAction = (playing) => ({
	type: SET_PLAYING, playing
})

export default function reducer (state = initialState, action = {}) {
	let newState = Object.assign({}, state)

	switch (action.type) {

	case REFRESH:
		RefreshMidi()
		return state

	case STATUS:
		newState.status = action.status
		return newState

	case ERROR:
		newState.error = action.error
		console.error('MIDI Error Received', action.error)
		return newState

	case CLOCKOUT:
		newState.outputs[action.index].clockOut = action.clockOut
		return state

	case SYSOUT:
		newState.outputs[action.index].sysOut = action.sysOut
		return state

	case SET_MIDI:
		newState.midi = action.midi
		return newState

	case SET_PORTS:
		newState.inputs = action.inputs
		newState.outputs = action.outputs
		return newState

	case SET_INBPM:
		newState.inbpm = action.bpm
		return newState

	case SET_BPM:
		newState.bpm = action.bpm
		return newState

	case SET_PLAYING:
		newState.playing = action.playing
		return newState

	case SET_SYNCMODE:
		newState.syncMode = action.syncMode
		return newState

	default:
		return state
	}
}
