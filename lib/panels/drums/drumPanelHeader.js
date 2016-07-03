import React from 'react'
import {Button, Col, Form, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import {addRowAction, togglePanelAction, changeDeviceAction} from 'lib/store/drums'
import SelectOutputDevice from 'lib/comps/selectOutputDevice'
import SelectChannel from 'lib/panels/drums/drumSelectChannel'

const mapStateToProps = (state) => ({
	visible: state.drums.visible
})

const mapDispatchToProps = (dispatch) => ({
	toggle () { dispatch(togglePanelAction()) },
	handleDevice (device) { dispatch(changeDeviceAction(device)) },
	addRow () { dispatch(addRowAction()) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Row>
		<Col xs={6}>
			<Button onClick={props.toggle} bsStyle='link' >
				<i className={props.visible ? 'fa fa-minus' : 'fa fa-plus'}></i>
			</Button>
			<span className={props.visible ? 'default' : 'text-muted'}>
				<span className='panel-header'>Drums</span>
			</span>
		</Col>
		<Col xs={6}>
			<Form inline>
				<div className='text-right'>
					<small className='text-muted'>CH:</small>
					<SelectChannel seq={props.seq}/>

					<small className='text-muted'>PORT:</small>
					<SelectOutputDevice bsSize='small' value={props.device} onChange={props.handleDevice} />

					<Button onClick={props.addRow}>Add row <i className='fa fa-plus'></i></Button>
				</div>
			</Form>
		</Col>
	</Row>
)
