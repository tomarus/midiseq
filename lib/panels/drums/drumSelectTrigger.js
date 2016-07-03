import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {setTriggerAction} from 'lib/store/drums'

const mapStateToProps = (state, props) => ({
	trigger: state.drums.rows[parseInt(props.index, 10)].trigger
})

const mapDispatchToProps = (dispatch) => ({
	onChange (index, trigger) { dispatch(setTriggerAction(index, trigger)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<FormGroup>
		<FormControl componentClass='select' value={props.trigger}
			onChange={(e) => { props.onChange(props.index, parseInt(e.target.value, 10)) }}>
			{[...Array(24).keys()].map((index) =>
				<option key={index + 1} value={index + 1}>{index + 1}</option>
			)}
		</FormControl>
	</FormGroup>
)
