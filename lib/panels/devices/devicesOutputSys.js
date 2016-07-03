import React from 'react'
import {connect} from 'react-redux'
import {Checkbox} from 'react-bootstrap'

import {sysOutAction} from 'lib/store/midi'

const mapStateToProps = (state, props) => {
	return {
		sysOut: state.midi.outputs[props.index].sysOut || false
	}
}

const mapDispatchToProps = (dispatch) => ({
	onChange (index, sysOut) { dispatch(sysOutAction(index, sysOut)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Checkbox checked={props.sysOut} inline
		onChange={(e) => { props.onChange(props.index, !props.sysOut) }}>
		<span>&nbsp;</span>
	</Checkbox>
)
