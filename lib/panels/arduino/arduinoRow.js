import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

import {
	changeInChannelAction, changeInPortAction,
	changeOutChannelAction, changeOutPortAction,
	setTransposeAction, deleteRouteAction } from 'lib/store/arduino'

import SelectChannel from 'lib/comps/selectChannel'
import SelectTranspose from 'lib/comps/selectTranspose'
import ArduinoSelectPort from 'lib/panels/arduino/arduinoSelectPort'
import ArduinoRowEnabled from 'lib/panels/arduino/arduinoRowEnabled'

const mapStateToProps = (state, props) => {
	return {
		inPorts: state.arduino.inPorts,
		outPorts: state.arduino.outPorts,
		inPort: state.arduino.routes[props.index].in,
		outPort: state.arduino.routes[props.index].out,
		inch: state.arduino.routes[props.index].inch,
		outch: state.arduino.routes[props.index].outch,
		transpose: state.arduino.routes[props.index].transpose
	}
}

const mapDispatchToProps = (dispatch) => ({
	handleInPort (index, port) { dispatch(changeInPortAction(index, port)) },
	handleOutPort (index, port) { dispatch(changeOutPortAction(index, port)) },
	handleInChannel (index, channel) { dispatch(changeInChannelAction(index, channel)) },
	handleOutChannel (index, channel) { dispatch(changeOutChannelAction(index, channel)) },
	handleTranspose (index, transpose) { dispatch(setTransposeAction(index, transpose)) },
	handleDelete (index) { dispatch(deleteRouteAction(index)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<tr>
		<td><ArduinoRowEnabled index={props.index}/></td>

		<td><ArduinoSelectPort port={props.inPort} max={props.inPorts} onChange={props.handleInPort}/></td>

		<td><SelectChannel index={props.index} channel={props.inch}
			onChange={props.handleInChannel}/></td>

		<td><ArduinoSelectPort port={props.outPort} max={props.outPorts} onChange={props.handleOutPort}/></td>

		<td><SelectChannel index={props.index} channel={props.outch}
			onChange={props.handleOutChannel}/></td>

		<td><SelectTranspose index={props.index} transpose={props.transpose}
			onChange={props.handleTranspose}/></td>

		<td><Button onClick={() => { props.handleDelete(props.index) }}><i className='fa fa-trash-o'></i></Button></td>
	</tr>
)
