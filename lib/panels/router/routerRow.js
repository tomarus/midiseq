import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

import {changeInputAction, changeOutputAction, changeInputChannelAction, changeOutputChannelAction, setTransposeAction, deleteRouteAction} from 'lib/store/router'
import SelectChannel from 'lib/comps/selectChannel'
import SelectInputDevice from 'lib/comps/selectInputDevice'
import SelectOutputDevice from 'lib/comps/selectOutputDevice'
import SelectTranspose from 'lib/comps/selectTranspose'
import RouterRowEnabled from 'lib/panels/router/routerRowEnabled'

const mapStateToProps = (state, props) => {
	return {
		in: state.router.routes[props.index].in,
		out: state.router.routes[props.index].out,
		inch: state.router.routes[props.index].inch,
		outch: state.router.routes[props.index].outch,
		transpose: state.router.routes[props.index].transpose
	}
}

const mapDispatchToProps = (dispatch) => ({
	handleInDevice (index, input) { dispatch(changeInputAction(index, input)) },
	handleOutDevice (index, output) { dispatch(changeOutputAction(index, output)) },
	handleInChannel (index, channel) { dispatch(changeInputChannelAction(index, channel)) },
	handleOutChannel (index, channel) { dispatch(changeOutputChannelAction(index, channel)) },
	handleTranspose (index, transpose) { dispatch(setTransposeAction(index, transpose)) },
	handleDelete (index) { dispatch(deleteRouteAction(index)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<tr>
		<td><RouterRowEnabled index={props.index}/></td>

		<td><SelectInputDevice value={props.in}
			onChange={(device) => { props.handleInDevice(props.index, device) }}/></td>

		<td><SelectChannel index={props.index} channel={props.inch}
			onChange={props.handleInChannel}/></td>

		<td><SelectOutputDevice value={props.out}
			onChange={(device) => { props.handleOutDevice(props.index, device) }}/></td>

		<td><SelectChannel index={props.index} channel={props.outch}
			onChange={props.handleOutChannel}/></td>

		<td><SelectTranspose index={props.index} transpose={props.transpose}
			onChange={props.handleTranspose}/></td>

		<td><Button onClick={() => { props.handleDelete(props.index) }}><i className='fa fa-trash-o'></i></Button></td>
	</tr>
)
