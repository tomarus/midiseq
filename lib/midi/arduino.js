import {setBPMAction, setConfigAction} from 'lib/store/arduino'

let store
let outputs
let inputs
let routes
let detectedPort

function select (state) {
	outputs = state.midi.outputs
	inputs = state.midi.inputs
	routes = state.arduino.routes
}

function Init (newstore) {
	store = newstore
	store.subscribe(() => {
		select(store.getState())
	})
}

//

function Sysex (event) {
	let d = event.data
	if (d.length < 5) return
	if (!(d[1] === 0x7d && d[2] === 0x2a && d[3] === 0x4d)) return

	let command = d[4]
	if (command < 0x40) return

	switch (command) {
	case 0x40:
		let version = d[5]
		let inPorts = d[6]
		let outPorts = d[7]
		let bpm = (d[8] << 7) + d[9]
		store.dispatch(setConfigAction(version, inPorts, outPorts, bpm))
		inputs.forEach((input, index) => {
			if (input === event.source) {
				detectedPort = index
			}
		})
		break
	default:
		console.log('Unhandled Arduino MIDI Command', command, event)
		break
	}
}

function Scan () {
	outputs.forEach((output) => {
		output.send([
			0xf0, 0x7d,        // sysex, non commercial / educationall manufacturer id.
			0x2a, 0x4d,        // my own little secret magic number id for this router.
			0x00,              // COMMAND 0x00 = request sysex config dump.
			0xf7
		])
	})
}

function UpdateRoute (index, route) {
	outputs[detectedPort].send([
		0xf0, 0x7d,            // sysex, non commercial / educationall manufacturer id.
		0x2a, 0x4d,            // my own little secret magic number id for this router.
		0x01, index,           // COMMAND 0x01 = update route.
		route.enabled ? 1 : 0,
		route.in,
		route.inch,
		route.out,
		route.outch,
		route.transpose + 0x40,
		0xf7
	])
}

function SetBPM (bpm) {
	outputs[detectedPort].send([
		0xf0, 0x7d,            // sysex, non commercial / educationall manufacturer id.
		0x2a, 0x4d,            // my own little secret magic number id for this router.
		0x02,                  // COMMAND 0x02 = set speed.
		bpm >> 7, bpm & 0x7f,  // set lsb/msb separately.
		0xf7
	])
	store.dispatch(setBPMAction(bpm))
}

var arduino = {Init, Sysex, Scan, SetBPM, UpdateRoute}
export default arduino
