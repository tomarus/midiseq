import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {setTriggerAction} from 'lib/store/sequencer'

const mapStateToProps = (state, props) => ({
	trigger: state.sequencer.seq[parseInt(props.seq, 10)].trigger
})

const mapDispatchToProps = (dispatch) => ({
	onChange (index, trigger) { dispatch(setTriggerAction(index, trigger)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<FormGroup bsSize='small'>
		<FormControl componentClass='select' value={props.trigger}
			onChange={(e) => { props.onChange(props.seq, parseInt(e.target.value, 10)) }}>
			{[...Array(24).keys()].map((index) =>
				<option key={index + 1} value={index + 1}>{index + 1}</option>
			)}
		</FormControl>
	</FormGroup>
)
