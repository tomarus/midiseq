import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {changeChannelAction} from 'lib/store/drums'

const mapStateToProps = (state, props) => ({
	channel: state.drums.channel
})

const mapDispatchToProps = (dispatch) => ({
	onChange (channel) { dispatch(changeChannelAction(channel)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<FormGroup bsSize='small'>
		<FormControl componentClass='select' value={props.channel}
			onChange={(e) => { props.onChange(parseInt(e.target.value, 10)) }}>
			{[...Array(16).keys()].map((index) =>
				<option key={index} value={index}>{index + 1}</option>
			)}
		</FormControl>
	</FormGroup>
)
