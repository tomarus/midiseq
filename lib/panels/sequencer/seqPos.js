import React from 'react'
import {connect} from 'react-redux'

const mapStateToProps = (state, props) => ({
	mute: state.sequencer.seq[props.seq].mute,
	active: state.sequencer.players[parseInt(props.seq, 10)].active[parseInt(props.index, 10)]
})

export default connect(mapStateToProps)((props) =>
	<td className={props.active && !props.mute ? 'danger' : 'default'}>
		{props.index + 1}
	</td>
)
