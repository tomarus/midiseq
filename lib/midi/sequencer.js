import {updatePlayersAction} from 'lib/store/sequencer'

let store
let rows
let outputs
let players = [
	{
		count: 0,
		note: 0,
		lastnote: 0,
		reppos: 0,
		lastnoteoff: 0,
		looppos: 0,
		active: [...Array(8)]
	}
]

function select (state) {
	rows = state.sequencer.seq
	outputs = state.midi.outputs
	if (rows.length !== players.length) {
		players = rows.map(() => {
			return {
				count: 0,
				note: 0,
				lastnote: 0,
				reppos: 0,
				lastnoteoff: 0,
				looppos: 0,
				active: [...Array(8)]
			}
		})
	}
}

function Init (newstore) {
	store = newstore
	store.subscribe(() => {
		select(store.getState())
	})
}

//

function Play () {
	players = rows.map(() => {
		return {
			count: 0,
			note: 0,
			lastnote: 0,
			reppos: 0,
			lastnoteoff: 0,
			looppos: 0,
			lastActive: 0,
			active: [...Array(8)]
		}
	})
}

function Stop () {
	players.forEach((player, index) => {
		outputs[rows[index].device].send([0x80 + rows[index].channel, player.lastnote, 0])
		outputs[rows[index].device].send([0xb0 + rows[index].channel, 120, 0])
		outputs[rows[index].device].send([0xb0 + rows[index].channel, 123, 0])
	})
}

function Tick () {
	players.forEach((player, index) => {
		playerTick(player, index)
	})

	store.dispatch(updatePlayersAction(players))
}

function playerTick (player, index) {
	let n = player
	let s = rows[index].sequence
	let loop = rows[index].loop
	let trigger = rows[index].trigger
	let mute = rows[index].mute
	let transpose = rows[index].transpose
	let output = outputs[rows[index].device]

	if (--n.lastnoteoff === 0 && !mute) output.send([0x80 + rows[index].channel, n.lastnote, 0])

	if (n.count % trigger === 0) {
		let trg = s[n.note].retrig || n.reppos === 0
		if (trg) {
			if (!mute) {
				output.send([0x80 + rows[index].channel, n.lastnote, 0])
				output.send([0x90 + rows[index].channel, s[n.note].note + transpose, s[n.note].vel])
			}
			n.active[n.lastActive] = false
			n.active[n.note] = true
			n.lastActive = n.note
		}

		n.lastnote = s[n.note].note + transpose
		n.lastnoteoff = s[n.note].len //* (s[n.note].retrig ? 1 : s[n.note].repeat)

		// looping logic
		n.reppos++
		if (n.reppos >= s[n.note].repeat) {
			n.reppos = 0
			if (loop === 1) { // forward
				n.note++; if (n.note >= s.length) n.note = 0
			} else if (loop === 2) { // backward
				n.note--; if (n.note < 0) { n.note = s.length - 1 }
			} else if (loop === 3 && n.looppos === 0) { // pingpong forward
				n.note++; if (n.note >= s.length) { n.note = s.length - 1; n.looppos = 1 }
			} else if (loop === 3 && n.looppos === 1) { // pingpong backward
				n.note--; if (n.note < 0) { n.note = 0; n.looppos = 0 }
			} else if (loop === 4 && n.looppos === 0) { // innerpong forward
				n.note++; if (n.note >= s.length) { n.note = s.length - 2; n.looppos = 1 }
			} else if (loop === 4 && n.looppos === 1) { // innerpong backward
				n.note--; if (n.note < 0) { n.note = 1; n.looppos = 0 }
			} else {
				console.error('Cant be here', n)
			}
		}
	}

	n.count++
	player = n
}

var sequencer = {Init, Play, Stop, Tick}
export default sequencer
