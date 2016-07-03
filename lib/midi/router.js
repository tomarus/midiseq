let store
let routes
let outputs

function select (state) {
	outputs = state.midi.outputs
	routes = state.router.routes
}

function Init (newstore) {
	store = newstore
	store.subscribe(() => {
		select(store.getState())
	})
}

//

function MidiIN (event) {
	if (event.status < 0x80 || event.status >= 0xf0) return
	routes.forEach((route) => {
		if (route.enabled) handleRoute(route, event)
	})
}

function handleRoute (route, event) {
	if (route.transpose !== 0 && event.status >= 0x80 && event.status < 0xa0) {
		event.data[1] += route.transpose
	}
	if (route.inch === -1 && route.outch === -1) {
		outputs[route.out].send(event.data)
		return
	}
	if (event.channel === route.inch) {
		event.data[0] &= 0xf0
		event.data[0] |= route.outch
		outputs[route.out].send(event.data)
		return
	}
}

var router = {Init, MidiIN}
export default router
