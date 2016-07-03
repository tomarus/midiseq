const ADD_ROUTE = 'route/ADD_ROUTE'
const DEL_ROUTE = 'route/DEL_ROUTE'
const ENABLE_ROUTE = 'route/ENABLE_ROUTE'
const CHANGE_INPUT = 'route/CHANGE_INPUT'
const CHANGE_OUTPUT = 'route/CHANGE_OUTPUT'
const CHANGE_INPUT_CH = 'route/CHANGE_INPUT_CH'
const CHANGE_OUTPUT_CH = 'route/CHANGE_OUTPUT_CH'
const SET_TRANSPOSE = 'route/SET_TRANSPOSE'

const initialRouteState = {
	enabled: false,
	in: 0,
	inch: 11,
	out: 0,
	outch: 9,
	transpose: 0
}

const initialState = {
	routes: [
		JSON.parse(JSON.stringify(initialRouteState))
	]
}

export const addRouteAction = (route) => ({
	type: ADD_ROUTE
})

export const deleteRouteAction = (index) => ({
	type: DEL_ROUTE, index
})

export const enableRouteAction = (index, enabled) => ({
	type: ENABLE_ROUTE, index, enabled
})

export const changeInputAction = (index, input) => ({
	type: CHANGE_INPUT, index, input
})

export const changeOutputAction = (index, output) => ({
	type: CHANGE_OUTPUT, index, output
})

export const changeInputChannelAction = (index, channel) => ({
	type: CHANGE_INPUT_CH, index, channel
})

export const changeOutputChannelAction = (index, channel) => ({
	type: CHANGE_OUTPUT_CH, index, channel
})

export const setTransposeAction = (index, transpose) => ({
	type: SET_TRANSPOSE, index, transpose
})

//

const reducer = (state = initialState, action = {}) => {
	let newState = Object.assign({}, state)

	switch (action.type) {

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
		return newState

	case CHANGE_INPUT:
		newState.routes[action.index].in = action.input
		return newState

	case CHANGE_OUTPUT:
		newState.routes[action.index].out = action.output
		return newState

	case CHANGE_INPUT_CH:
		newState.routes[action.index].inch = action.channel
		return newState

	case CHANGE_OUTPUT_CH:
		newState.routes[action.index].outch = action.channel
		return newState

	case SET_TRANSPOSE:
		newState.routes[action.index].transpose = action.transpose
		return newState
	}

	return state
}

export default reducer
