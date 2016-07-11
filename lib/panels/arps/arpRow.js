import React from 'react'
import {Button, Form, FormControl, FormGroup, InputGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {arpExtendAction, arpSetNameAction, arpSetOffsetAction, arpSetTriggerAction} from 'lib/store/sequencer'
import ArpDot from 'lib/panels/arps/arpDot'
import EditNumber from 'lib/comps/editNumber'
import SelectTrigger from 'lib/comps/selectTrigger'

const mapStateToProps = (state, props) => ({
	trigger: state.sequencer.arps[props.index].trigger,
	offsets: state.sequencer.arps[props.index].offsets
})

const mapDispatchToProps = (dispatch) => ({
	handleTrigger (index, trigger) { dispatch(arpSetTriggerAction(index, trigger)) },
	handleName (index, name) { dispatch(arpSetNameAction(index, name)) },
	handleOffset (index, pos, offset) { dispatch(arpSetOffsetAction(index, pos, offset)) },
	handleExtendAction (index) { dispatch(arpExtendAction(index)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<tr>
		<td>
			<Form inline>
				<FormGroup bsSize='small'>
					<InputGroup bsize='small' className='form-control-inline'>
						<FormControl type='text' bsSize='small' value={props.index} onChange={props.handleName}/>
					</InputGroup>
				</FormGroup>
			</Form>
		</td>
		<td>
			<SelectTrigger value={props.trigger} index={props.index} onChange={props.handleTrigger} bsSize='small'/>
		</td>
		{props.offsets.map((index, n) =>
			<td key={n}>
				<table><tbody><tr><td>
					<ArpDot index={props.index} pos={n}/>
				</td><td>
					<EditNumber value={props.offsets[n]} min={0} max={48} disabled={n === 0}
						onChange={(offset) => { props.handleOffset(props.index, n, offset) }}/>
				</td></tr></tbody></table>
			</td>
		)}
		{[...Array(props.max - props.offsets.length).keys()].map((index, n) =>
			<td key={n + 1000}></td>
		)}
		<td><Button onClick={() => props.handleExtendAction(props.index)}><i className='fa fa-plus'></i></Button></td>
	</tr>
)
