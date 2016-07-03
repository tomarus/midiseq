const TOGGLE = 'drums/TOGGLE'
const ADD_ROW = 'drums/ADD_ROW'
const PLAYERS = 'drums/UPDATE_PLAYERS'

const SET_CHANNEL = 'drums/SET_CHANNEL'
const SET_DEVICE = 'drums/SET_DEVICE'

const MUTE = 'drums/row/MUTE'
const TRIGGER = 'drums/row/TRIGGER'
const INSTRUMENT = 'drums/row/INSTRUMENT'
const LENGTH = 'drums/row/LENGTH'
const TOGGLE_DOT = 'drums/row/TOGGLE_DOT'

export const initialDrumState = {
	instr: 36,
	trigger: 6,
	len: 16,
	mute: false,
	value: 0,
	dots: [...Array(16)]
}

export const initialPlayerState = {
	trig: -1,
	pos: 0,
	lastActive: -1,
	active: [...Array(16)]
}

const initialState = {
	visible: true,
	output: 0,
	channel: 9,
	rows: [
		{ instr: 36, trigger: 6, len: 16, mute: false, value: 0, dots: [
			true, false, false, false, true, false, false, false,
			true, false, false, false, true, false, false, false ] },
		{ instr: 38, trigger: 6, len: 16, mute: false, value: 0, dots: [
			false, false, false, false, true, false, false, false,
			false, false, false, false, true, false, false, false ] },
		{ instr: 42, trigger: 6, len: 2, mute: false, value: 0, dots: [ true, false ] },
		{ instr: 46, trigger: 6, len: 8, mute: false, value: 0, dots: [...Array(7), true] }
	],
	players: [
		JSON.parse(JSON.stringify(initialPlayerState)),
		JSON.parse(JSON.stringify(initialPlayerState)),
		JSON.parse(JSON.stringify(initialPlayerState)),
		JSON.parse(JSON.stringify(initialPlayerState))
	]
}

export const togglePanelAction = () => ({
	type: TOGGLE
})

export const addRowAction = () => ({
	type: ADD_ROW
})

export const updatePlayersAction = (players) => ({
	type: PLAYERS, players
})

export const changeChannelAction = (channel) => ({
	type: SET_CHANNEL, channel
})

export const changeDeviceAction = (output) => ({
	type: SET_DEVICE, output
})

//

export const setMuteAction = (index, mute) => ({
	type: MUTE, index, mute
})

export const setInstrumentAction = (index, instr) => ({
	type: INSTRUMENT, index, instr
})

export const setLengthAction = (index, len) => ({
	type: LENGTH, index, len
})

export const setTriggerAction = (index, trigger) => ({
	type: TRIGGER, index, trigger
})

export const toggleDotAction = (index, pos) => ({
	type: TOGGLE_DOT, index, pos
})

//

const reducer = (state = initialState, action = {}) => {
	let newState = Object.assign({}, state)

	switch (action.type) {

	case TOGGLE:
		newState.visible = !state.visible
		return newState

	case ADD_ROW:
		newState.rows = state.rows.slice()
		newState.rows.push(JSON.parse(JSON.stringify(initialDrumState)))
		newState.players = state.players.slice()
		newState.players.push(JSON.parse(JSON.stringify(initialPlayerState)))
		return newState

	case PLAYERS:
		newState.players = action.players
		return newState

	case SET_CHANNEL:
		newState.channel = action.channel
		return newState

	case SET_DEVICE:
		newState.output = action.output
		return newState

	// row based

	case MUTE:
		newState.rows[action.index].mute = action.mute
		return newState

	case INSTRUMENT:
		// newState.rows = state.rows.slice()
		newState.rows[action.index].instr = action.instr
		return newState

	case LENGTH:
		// newState.rows = state.rows.slice()
		newState.rows[action.index].len = action.len
		return newState

	case TRIGGER:
		// newState.rows = state.rows.slice()
		newState.rows[action.index].trigger = action.trigger
		return newState

	case TOGGLE_DOT:
		// newState.rows = state.rows.slice()
		newState.rows[action.index].dots[action.pos] = !state.rows[action.index].dots[action.pos]
		return newState
	}
	return state
}

export default reducer
