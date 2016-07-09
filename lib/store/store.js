import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'

import arduinoReducer from 'lib/store/arduino'
import midiReducer from 'lib/store/midi'
import sequencerReducer from 'lib/store/sequencer'
import drumsReducer from 'lib/store/drums'
import routerReducer from 'lib/store/router'

function logger ({ getState }) {
	return (next) => (action) => {
		console.log('will dispatch', action)

		// Call the next dispatch method in the middleware chain.
		let returnValue = next(action)
		console.log('state after dispatch', getState())

		// This will likely be the action itself, unless
		// a middleware further in chain changed it.
		return returnValue
	}
}

var reducers = combineReducers({
	midi: midiReducer,
	sequencer: sequencerReducer,
	drums: drumsReducer,
	router: routerReducer,
	arduino: arduinoReducer
})

var store = createStore(
	reducers,
	applyMiddleware(thunk)
)

export default store
