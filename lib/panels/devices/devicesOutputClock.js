import React from 'react'
import {connect} from 'react-redux'
import {Checkbox} from 'react-bootstrap'

import {clockOutAction} from 'lib/store/midi'

const mapStateToProps = (state, props) => {
	return {
		clockOut: state.midi.outputs[props.index].clockOut || false
	}
}

const mapDispatchToProps = (dispatch) => ({
	onChange (index, clockOut) { dispatch(clockOutAction(index, clockOut)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Checkbox checked={props.clockOut} inline
		onChange={(e) => { props.onChange(props.index, !props.clockOut) }}>
		<span>&nbsp;</span>
	</Checkbox>
)
