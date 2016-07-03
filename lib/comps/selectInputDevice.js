import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

const mapStateToProps = (state, props) => ({
	inputs: state.midi.inputs
})

export default connect(mapStateToProps)((props) =>
	<FormGroup bsSize={props.bsSize}>
		<FormControl componentClass='select' value={props.value}
			onChange={(e) => { props.onChange(parseInt(e.target.value, 10)) }}>
			{props.inputs.map((input, index) =>
				<option key={index} value={index}>{input.name}</option>
			)}
		</FormControl>
	</FormGroup>
)
