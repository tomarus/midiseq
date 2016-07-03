import React from 'react'
import {Button, Col, Form, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import {pad} from 'lib/util/util'
import {addRowAction, changeChannelAction, changeDeviceAction, toggleMuteAction, togglePanelAction} from 'lib/store/sequencer'
import MuteButton from 'lib/comps/muteButton'
import SelectOutputDevice from 'lib/comps/selectOutputDevice'
import SelectChannel from 'lib/panels/sequencer/seqSelectChannel'
import SelectLoop from 'lib/panels/sequencer/seqSelectLoop'
import SelectTrigger from 'lib/panels/sequencer/seqSelectTrigger'
import SelectTranspose from 'lib/panels/sequencer/seqSelectTranspose'

const mapStateToProps = (state, props) => ({
	mute: state.sequencer.seq[parseInt(props.seq, 10)].mute,
	device: state.sequencer.seq[parseInt(props.seq, 10)].device,
	visible: state.sequencer.seq[parseInt(props.seq, 10)].visible,
	outputs: state.midi.outputs
})

const mapDispatchToProps = (dispatch) => ({
	handleAddRow (seq) { dispatch(addRowAction(seq)) },
	handleMute (seq) { dispatch(toggleMuteAction(seq)) },
	handleChannel (seq, channel) { dispatch(changeChannelAction(seq, channel)) },
	handleDevice (seq, device) { dispatch(changeDeviceAction(seq, device)) },
	toggle (seq) { dispatch(togglePanelAction(seq)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Row>
		<Col xs={7}>
			<Form inline>
				<Button onClick={() => { props.toggle(props.seq) }} bsStyle='link'>
					<i className={props.visible ? 'fa fa-minus' : 'fa fa-plus'}></i>
				</Button>
				<span className={props.visible ? 'default' : 'text-muted'}>
					<span className='panel-header'>Sequencer {pad(props.seq, 2)}</span>
				</span>
				&nbsp; <small className='text-muted'>|</small> &nbsp;

				<small className='text-muted'>Mute:</small> &nbsp;
				<MuteButton muted={props.mute} onClick={() => props.handleMute(props.seq)} bsSize='small'/>

				<small className='text-muted'>Trigger:</small>
				<SelectTrigger seq={props.seq}/>

				<small className='text-muted'>Transpose:</small>
				<SelectTranspose seq={props.seq}/>

				<small className='text-muted'>Loop:</small>
				<SelectLoop seq={props.seq}/>
			</Form>
		</Col>

		<Col xs={5}>
			<Form inline>
				<div className='text-right'>
					<small className='text-muted'>CH:</small>
					<SelectChannel seq={props.seq}/>

					<small className='text-muted'>PORT:</small>
					<SelectOutputDevice bsSize='small' value={props.device} onChange={(v) => { props.handleDevice(props.seq, v) }} />

					<Button onClick={() => { props.handleAddRow(props.seq) }}>Add row <i className='fa fa-plus'></i></Button>
				</div>
			</Form>
		</Col>
	</Row>
)
