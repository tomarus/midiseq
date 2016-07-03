import {updatePlayersAction, initialPlayerState} from 'lib/store/drums'

let store
let rows
let outputs
let players = []
let output
let channel

function select (state) {
	outputs = state.midi.outputs

	rows = state.drums.rows
	output = state.drums.output
	channel = state.drums.channel

	if (rows.length > players.length) {
		do {
			players.push(JSON.parse(JSON.stringify(initialPlayerState)))
		} while (rows.length > players.length)
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
	players = rows.map(() => { return JSON.parse(JSON.stringify(initialPlayerState)) })
}

function Stop () {
}

function Tick () {
	players.forEach((player, index) => {
		playerTick(player, index)
	})

	store.dispatch(updatePlayersAction(players))
}

function playerTick (player, index) {
	player.trig++

	if (player.trig % rows[index].trigger === 0) {
		player.active[player.lastActive] = false
		player.lastActive++
		if (player.lastActive >= rows[index].len) {
			player.lastActive = 0
		}

		if (!rows[index].mute) {
			player.active[player.lastActive] = true

			if (rows[index].dots[player.lastActive]) {
				outputs[output].send([0x90 + channel, rows[index].instr, 127])
			}
		}
	}
}

var drums = {Init, Play, Stop, Tick}
export default drums
