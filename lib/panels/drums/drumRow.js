import React from 'react'
import {connect} from 'react-redux'

import {setMuteAction} from 'lib/store/drums'
import MuteButton from 'lib/comps/muteButton'
import DrumSelectInstrument from 'lib/panels/drums/drumSelectInstrument'
import DrumSelectLength from 'lib/panels/drums/drumSelectLen'
import DrumSelectTrigger from 'lib/panels/drums/drumSelectTrigger'
import DrumDots from 'lib/panels/drums/drumDots'

const mapStateToProps = (state, props) => ({
	mute: state.drums.rows[parseInt(props.index, 10)].mute
})

const mapDispatchToProps = (dispatch) => ({
	handleMute (index, mute) { dispatch(setMuteAction(index, mute)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<tr>
		<td><MuteButton muted={props.mute}
			onClick={() => { props.handleMute(props.index, !props.mute) }}/></td>
		<td><DrumSelectInstrument index={props.index}/></td>
		<td><DrumSelectTrigger index={props.index}/></td>
		<td><DrumSelectLength index={props.index}/></td>
		<td><DrumDots index={props.index}/></td>
	</tr>
)
