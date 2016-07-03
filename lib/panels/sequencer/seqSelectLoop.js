import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {setLoopAction} from 'lib/store/sequencer'

const mapStateToProps = (state, props) => ({
	loop: state.sequencer.seq[parseInt(props.seq, 10)].loop
})

const mapDispatchToProps = (dispatch) => ({
	onChange (index, loop) { dispatch(setLoopAction(index, loop)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<FormGroup bsSize='small'>
		<FormControl componentClass='select' value={props.loop}
			onChange={(e) => { props.onChange(props.seq, parseInt(e.target.value, 10)) }}>
			<option key={1} value={1}>Forward</option>
			<option key={2} value={2}>Backward</option>
			<option key={3} value={3}>Pingpong</option>
			<option key={4} value={4}>Inner</option>
		</FormControl>
	</FormGroup>
)
