import React from 'react'
import {connect} from 'react-redux'

import {setMuteAction, setTriggerAction} from 'lib/store/drums'
import MuteButton from 'lib/comps/muteButton'
import SelectTrigger from 'lib/comps/selectTrigger'
import DrumSelectInstrument from 'lib/panels/drums/drumSelectInstrument'
import DrumSelectLength from 'lib/panels/drums/drumSelectLen'
import DrumDots from 'lib/panels/drums/drumDots'

const mapStateToProps = (state, props) => ({
	mute: state.drums.rows[parseInt(props.index, 10)].mute,
	trigger: state.drums.rows[parseInt(props.index, 10)].trigger
})

const mapDispatchToProps = (dispatch) => ({
	handleMute (index, mute) { dispatch(setMuteAction(index, mute)) },
	handleTrigger (index, trigger) { dispatch(setTriggerAction(index, trigger)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<tr>
		<td><MuteButton muted={props.mute}
			onClick={() => { props.handleMute(props.index, !props.mute) }}/></td>
		<td><DrumSelectInstrument index={props.index}/></td>
		<td><SelectTrigger index={props.index} value={props.trigger} onChange={props.handleTrigger}/></td>
		<td><DrumSelectLength index={props.index}/></td>
		<td><DrumDots index={props.index}/></td>
	</tr>
)
