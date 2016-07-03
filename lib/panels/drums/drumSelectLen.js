import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {setLengthAction} from 'lib/store/drums'

const mapStateToProps = (state, props) => ({
	len: state.drums.rows[parseInt(props.index, 10)].len
})

const mapDispatchToProps = (dispatch) => ({
	onChange (index, len) { dispatch(setLengthAction(index, len)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<FormGroup>
		<FormControl componentClass='select' value={props.len}
			onChange={(e) => { props.onChange(props.index, parseInt(e.target.value, 10)) }}>
			{[...Array(16).keys()].map((index) =>
				<option key={index + 1} value={index + 1}>{index + 1}</option>
			)}
		</FormControl>
	</FormGroup>
)
