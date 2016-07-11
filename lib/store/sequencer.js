// import store from 'lib/store/store'

const PLAYERS        = 'sequencer/PLAYERS'
const TOGGLE         = 'sequencer/TOGGLE'

const SET_CHANNEL    = 'sequencer/SET_CHANNEL'
const SET_DEVICE     = 'sequencer/SET_DEVICE'
const SET_TRIGGER    = 'sequencer/SET_TRIGGER'
const SET_TRANSPOSE  = 'sequencer/SET_TRANSPOSE'
const SET_MUTE       = 'sequencer/SET_MUTE'
const SET_LOOP       = 'sequencer/SET_LOOP'
const SET_NAME       = 'sequencer/SET_NAME'
const ADD_ROW        = 'sequencer/ADD_ROW'

const SET_SEQ_NOTE   = 'sequencer/seq/SET_NOTE'
const SET_SEQ_REPEAT = 'sequencer/seq/SET_REPEAT'
const SET_SEQ_RETRIG = 'sequencer/seq/SET_RETRIG'
const SET_SEQ_VEL    = 'sequencer/seq/SET_VEL'
const SET_SEQ_LEN    = 'sequencer/seq/SET_LEN'
const SET_SEQ_ARP    = 'sequencer/seq/SET_ARP'
const SET_SEQ_DELETE = 'sequencer/seq/DELETE'

let defaultRow = {
	note: 48, repeat: 1, retrig: false, len: 0, vel: 100, arp: '', active: false
}

export var initialPlayerState = {
	count: 0,
	note: 0,
	lastnote: 0,
	reppos: 0,
	lastnoteoff: 0,
	looppos: 0,
	arppos: 0,
	lastActive: 0,
	active: [...Array(8)]
}

let initialState = {
	seq: [
		{
			device: 0,
			visible: true,
			channel: 1,
			trigger: 6,
			transpose: 0,
			mute: false,
			loop: 1, // 1=fwd, 2=rev, 3=pingpong, 4=inner pingpong
			name: 'default',
			sequence: [
				{ note: 49, repeat: 1, retrig: false, len: 0, vel: 100, arp: '', active: false },
				{ note: 60, repeat: 2, retrig: true, len: 0, vel: 100, arp: '', active: false },
				{ note: 48, repeat: 1, retrig: false, len: 0, vel: 100, arp: '', active: false },
				{ note: 60, repeat: 2, retrig: true, len: 0, vel: 100, arp: '', active: false },
				{ note: 49, repeat: 1, retrig: false, len: 0, vel: 100, arp: '', active: false },
				{ note: 60, repeat: 2, retrig: true, len: 0, vel: 100, arp: '', active: false },
				{ note: 49, repeat: 2, retrig: true, len: 0, vel: 100, arp: '', active: false },
				{ note: 72, repeat: 1, retrig: false, len: 1, vel: 100, arp: '', active: false }
			]
		},
		{
			device: 0,
			visible: true,
			channel: 2,
			trigger: 6,
			transpose: 0,
			mute: false,
			loop: 1, // 1=fwd, 2=rev, 3=pingpong, 4=inner pingpong
			name: 'default',
			sequence: [
				{ note: 49, repeat: 1, retrig: false, len: 0, vel: 100, arp: '', active: false },
				{ note: 60, repeat: 2, retrig: true, len: 0, vel: 100, arp: '', active: false },
				{ note: 48, repeat: 1, retrig: false, len: 0, vel: 100, arp: '', active: false },
				{ note: 60, repeat: 2, retrig: true, len: 0, vel: 100, arp: '', active: false },
				{ note: 49, repeat: 1, retrig: false, len: 0, vel: 100, arp: '', active: false },
				{ note: 60, repeat: 2, retrig: true, len: 0, vel: 100, arp: '', active: false },
				{ note: 49, repeat: 2, retrig: true, len: 0, vel: 100, arp: '', active: false },
				{ note: 72, repeat: 1, retrig: false, len: 1, vel: 100, arp: '', active: false }
			]
		}
	],
	players: [
		JSON.parse(JSON.stringify(initialPlayerState)),
		JSON.parse(JSON.stringify(initialPlayerState))
	],
	arps: {
		'00': {
			offsets: [0, 7, 12, 19, 24, 31, 36],
			trigger: 12
		},
		'01': {
			offsets: [0, 12, 24, 36, 48, 36, 24, 12],
			trigger: 12
		},
		'02': {
			offsets: [0, 12],
			trigger: 12
		}
	}
}

// sequencer global

export const updatePlayersAction = (players) => ({
	type: PLAYERS, players
})

export const togglePanelAction = (seq) => ({
	type: TOGGLE, seq
})

export const toggleMuteAction = (seq) => ({
	type: SET_MUTE, seq
})

export const changeChannelAction = (seq, channel) => ({
	type: SET_CHANNEL, seq, channel
})

export const changeDeviceAction = (seq, device) => ({
	type: SET_DEVICE, seq, device
})

export const setTriggerAction = (seq, trigger) => ({
	type: SET_TRIGGER, seq, trigger
})

export const setTransposeAction = (seq, transpose) => ({
	type: SET_TRANSPOSE, seq, transpose
})

export const setLoopAction = (seq, loop) => ({
	type: SET_LOOP, seq, loop
})

export const setNameAction = (seq, name) => ({
	type: SET_NAME, seq, name
})

export const addRowAction = (seq) => ({
	type: ADD_ROW, seq
})

// row based

export const seqNoteAction = (seq, pos, note) => ({
	type: SET_SEQ_NOTE, seq, pos, note
})

export const seqRepeatAction = (seq, pos, repeat) => ({
	type: SET_SEQ_REPEAT, seq, pos, repeat
})

export const seqRetrigAction = (seq, pos, retrig) => ({
	type: SET_SEQ_RETRIG, seq, pos, retrig
})

export const seqVelocityAction = (seq, pos, vel) => ({
	type: SET_SEQ_VEL, seq, pos, vel
})

export const seqLengthAction = (seq, pos, len) => ({
	type: SET_SEQ_LEN, seq, pos, len
})

export const seqSetArpAction = (seq, pos, arp) => ({
	type: SET_SEQ_ARP, seq, pos, arp
})

export const seqDeleteAction = (seq, pos) => ({
	type: SET_SEQ_DELETE, seq, pos
})

//

export default function reducer (state = initialState, action = {}) {
	let newState = Object.assign({}, state)

	switch (action.type) {

	case PLAYERS:
		newState.players = action.players
		return newState

	case TOGGLE:
		newState.seq[action.seq].visible = !state.seq[action.seq].visible
		return newState

	case SET_CHANNEL:
		newState.seq[action.seq].channel = action.channel
		return newState

	case SET_DEVICE:
		newState.seq[action.seq].device = action.device
		return newState

	case SET_TRIGGER:
		newState.seq[action.seq].trigger = action.trigger
		return newState

	case SET_TRANSPOSE:
		newState.seq[action.seq].transpose = action.transpose
		return newState

	case SET_MUTE:
		newState.seq[action.seq].mute = !state.seq[action.seq].mute
		return newState

	case SET_LOOP:
		newState.seq[action.seq].loop = action.loop
		return newState

	case SET_NAME:
		newState.seq[action.seq].name = action.name
		return newState

	case ADD_ROW:
		newState.seq[action.seq].sequence = state.seq[action.seq].sequence.slice()
		newState.seq[action.seq].sequence.push(JSON.parse(JSON.stringify(defaultRow)))
		return newState

	//

	case SET_SEQ_NOTE:
		newState.seq[action.seq].sequence[action.pos].note = action.note
		return newState

	case SET_SEQ_REPEAT:
		newState.seq[action.seq].sequence[action.pos].repeat = action.repeat
		return newState

	case SET_SEQ_RETRIG:
		newState.seq[action.seq].sequence[action.pos].retrig = action.retrig
		return newState

	case SET_SEQ_VEL:
		newState.seq[action.seq].sequence[action.pos].vel = action.vel
		return newState

	case SET_SEQ_LEN:
		newState.seq[action.seq].sequence[action.pos].len = action.len
		return newState

	case SET_SEQ_ARP:
		newState.seq[action.seq].sequence[action.pos].arp = action.arp
		return newState

	case SET_SEQ_DELETE:
		newState.seq[action.seq].sequence = state.seq[action.seq].sequence.slice()
		newState.seq[action.seq].sequence.splice(action.pos, 1)
		return newState

	default:
		return state
	}
}
