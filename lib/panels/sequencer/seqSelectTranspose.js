import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {setTransposeAction} from 'lib/store/sequencer'

const mapStateToProps = (state, props) => ({
	transpose: state.sequencer.seq[parseInt(props.seq, 10)].transpose
})

const mapDispatchToProps = (dispatch) => ({
	onChange (index, transpose) { dispatch(setTransposeAction(index, transpose)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<FormGroup bsSize='small'>
		<FormControl componentClass='select' value={props.transpose}
			onChange={(e) => { props.onChange(props.seq, parseInt(e.target.value, 10)) }}>
			{[...Array(49).keys()].map((index) =>
				<option key={index - 24} value={index - 24}>{index - 24}</option>
			)}
		</FormControl>
	</FormGroup>
)
