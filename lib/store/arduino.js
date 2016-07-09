import arduino from 'lib/midi/arduino'

const SET_BPM = 'arduino/SET_BPM'
const SET_CONFIG = 'arduino/SET_CONFIG'
const ADD_ROUTE = 'arduino/ADD_ROUTE'
const DEL_ROUTE = 'arduino/DEL_ROUTE'
const ENABLE_ROUTE = 'arduino/ENABLE_ROUTE'
const CHANGE_INPUT = 'arduino/CHANGE_INPUT'
const CHANGE_OUTPUT = 'arduino/CHANGE_OUTPUT'
const CHANGE_INPUT_CH = 'arduino/CHANGE_INPUT_CH'
const CHANGE_OUTPUT_CH = 'arduino/CHANGE_OUTPUT_CH'
const SET_TRANSPOSE = 'arduino/SET_TRANSPOSE'

const initialRouteState = {
	enabled: false,
	in: 0,
	inch: 11,
	out: 0,
	outch: 9,
	transpose: 0
}

const initialState = {
	available: false,
	version: 0,
	inPorts: 0,
	outPorts: 0,
	bpm: 0,
	routes: [
		JSON.parse(JSON.stringify(initialRouteState))
	]
}

export const setConfigAction = (version, inPorts, outPorts, bpm) => ({
	type: SET_CONFIG, version, inPorts, outPorts, bpm
})

export const setBPMAction = (bpm) => ({
	type: SET_BPM, bpm
})

// below here is the same as router.js

export const addRouteAction = () => ({
	type: ADD_ROUTE
})

export const deleteRouteAction = (index) => ({
	type: DEL_ROUTE, index
})

export const enableRouteAction = (index, enabled) => ({
	type: ENABLE_ROUTE, index, enabled
})

export const changeInPortAction = (index, input) => ({
	type: CHANGE_INPUT, index, input
})

export const changeOutPortAction = (index, output) => ({
	type: CHANGE_OUTPUT, index, output
})

export const changeInChannelAction = (index, channel) => ({
	type: CHANGE_INPUT_CH, index, channel
})

export const changeOutChannelAction = (index, channel) => ({
	type: CHANGE_OUTPUT_CH, index, channel
})

export const setTransposeAction = (index, transpose) => ({
	type: SET_TRANSPOSE, index, transpose
})

//

const reducer = (state = initialState, action = {}) => {
	let newState = Object.assign({}, state)

	switch (action.type) {

	case SET_BPM:
		newState.bpm = action.bpm
		return newState

	case SET_CONFIG:
		newState.inPorts = action.inPorts
		newState.outPorts = action.outPorts
		newState.bpm = action.bpm
		newState.version = action.version
		newState.available = true
		return newState

	// below here is the same as router.js

	case ADD_ROUTE:
		newState.routes = state.routes.slice()
		newState.routes.push(JSON.parse(JSON.stringify(initialRouteState)))
		return newState

	case DEL_ROUTE:
		newState.routes = state.routes.slice()
		newState.routes.splice(action.index, 1)
		return newState

	case ENABLE_ROUTE:
		newState.routes[action.index].enabled = action.enabled
		arduino.UpdateRoute(action.index, newState.routes[action.index])
		return newState

	case CHANGE_INPUT:
		newState.routes[action.index].in = action.input
		arduino.UpdateRoute(action.index, newState.routes[action.index])
		return newState

	case CHANGE_OUTPUT:
		newState.routes[action.index].out = action.output
		arduino.UpdateRoute(action.index, newState.routes[action.index])
		return newState

	case CHANGE_INPUT_CH:
		newState.routes[action.index].inch = action.channel
		arduino.UpdateRoute(action.index, newState.routes[action.index])
		return newState

	case CHANGE_OUTPUT_CH:
		newState.routes[action.index].outch = action.channel
		arduino.UpdateRoute(action.index, newState.routes[action.index])
		return newState

	case SET_TRANSPOSE:
		newState.routes[action.index].transpose = action.transpose
		arduino.UpdateRoute(action.index, newState.routes[action.index])
		return newState
	}

	return state
}

export default reducer
