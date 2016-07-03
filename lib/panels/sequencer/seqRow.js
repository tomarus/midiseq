import React from 'react'
import {connect} from 'react-redux'

import {seqNoteAction, seqRepeatAction, seqVelocityAction, seqLengthAction} from 'lib/store/sequencer'
import SelectNote from 'lib/comps/selectNote'
import EditNumber from 'lib/comps/editNumber'
import SeqPos from 'lib/panels/sequencer/seqPos'
import SeqRowRetrig from 'lib/panels/sequencer/seqRowRetrig'
import SeqRowDelete from 'lib/panels/sequencer/seqRowDelete'

const mapStateToProps = (state, props) => ({
	row: state.sequencer.seq[parseInt(props.seq, 10)].sequence[parseInt(props.index, 10)]
})

const mapDispatchToProps = (dispatch) => ({
	handleNote (seq, pos, note) { dispatch(seqNoteAction(seq, pos, note)) },
	handleRepeat (seq, pos, repeat) { dispatch(seqRepeatAction(seq, pos, repeat)) },
	handleVelocity (seq, pos, vel) { dispatch(seqVelocityAction(seq, pos, vel)) },
	handleLength (seq, pos, len) { dispatch(seqLengthAction(seq, pos, len)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<tr>
		<SeqPos seq={props.seq} index={props.index}/>

		<td><SelectNote pos={props.index} note={props.row.note}
			onChange={(note) => { props.handleNote(props.seq, props.index, note) }}/>
		</td>

		<td><EditNumber value={props.row.repeat} max={1536}
			onChange={(repeat) => { props.handleRepeat(props.seq, props.index, repeat) }}/>
		</td>

		<td><SeqRowRetrig seq={props.seq} index={props.index}/></td>

		<td><EditNumber value={props.row.vel} min={0} max={127}
			onChange={(velocity) => { props.handleVelocity(props.seq, props.index, velocity) }}/>
		</td>

		<td><EditNumber value={props.row.len} min={0} max={96}
			onChange={(len) => { props.handleLength(props.seq, props.index, len) }}/>
		</td>

		<td><SeqRowDelete seq={props.seq} index={props.index}/></td>
	</tr>
)
