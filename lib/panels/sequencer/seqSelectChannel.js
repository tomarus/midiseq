import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {changeChannelAction} from 'lib/store/sequencer'

const mapStateToProps = (state, props) => ({
	channel: state.sequencer.seq[parseInt(props.seq, 10)].channel
})

const mapDispatchToProps = (dispatch) => ({
	onChange (index, channel) { dispatch(changeChannelAction(index, channel)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<FormGroup bsSize='small'>
		<FormControl componentClass='select' value={props.channel}
			onChange={(e) => { props.onChange(props.seq, parseInt(e.target.value, 10)) }}>
			{[...Array(16).keys()].map((index) =>
				<option key={index} value={index}>{index + 1}</option>
			)}
		</FormControl>
	</FormGroup>
)
