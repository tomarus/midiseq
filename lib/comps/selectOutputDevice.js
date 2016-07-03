import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

const mapStateToProps = (state, props) => ({
	outputs: state.midi.outputs
})

export default connect(mapStateToProps)((props) =>
	<FormGroup bsSize={props.bsSize}>
		<FormControl componentClass='select' value={props.value}
			onChange={(e) => { props.onChange(parseInt(e.target.value, 10)) }}>
			{props.outputs.map((output, index) =>
				<option key={index} value={index}>{output.name}</option>
			)}
		</FormControl>
	</FormGroup>
)
