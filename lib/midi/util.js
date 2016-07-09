import data from 'lib/midi/data'

export function Pad (num, places) {
	let zero = places - num.toString().length + 1
	return Array(+(zero > 0 && zero)).join('0') + num
}

export function Timestamp (time) {
	let t = window.performance.timing.fetchStart + time
	let d = new Date(t)
	let opts = {
		hour12: false
	}
	return d.toLocaleTimeString('en-us', opts) + '.' + Pad((t % 1000).toFixed(0), 3)
}

let notes = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-']

export function Note (note) {
	return notes[note % 12] + (Math.round(note / 12 - 0.5))
}

// Hex formats an integer to a hex string.
export function Hex (value) {
	let num = parseInt(value)
	if (num < 0) {
		num = 0xFFFFFFFF + num + 1
	}
	return num.toString(16)
}

// Status returns a string from a status value.
export function Status (msg) {
	let base = msg.status >> 4 & 15
	switch (base) {
	case 0x8:
	case 0x9:
		return data.Status[base - 8] + ' ' + Note(msg.data[1])
	case 0xb:
		let c = parseInt(msg.data[1], 10)
		return 'CC ' + msg.data[1] + ' ' + data.Controllers[c]
	case 0xf:
		return data.System[msg.status & 15]
	default:
		return data.Status[base - 8]
	}
}
