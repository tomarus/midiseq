import React from 'react'
import {Button, Col, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import {addArpAction, toggleArpPanelAction} from 'lib/store/sequencer'

const mapStateToProps = (state) => ({
	visible: state.sequencer.arpvisible
})

const mapDispatchToProps = (dispatch) => ({
	toggleArp () { dispatch(toggleArpPanelAction()) },
	addArp () { dispatch(addArpAction()) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Row>
		<Col xs={6}>
			<Button onClick={props.toggleArp} bsStyle='link' >
				<i className={props.visible ? 'fa fa-minus' : 'fa fa-plus'}></i>
			</Button>
			<span className={props.visible ? 'default' : 'text-muted'}>
				<span className='panel-header'>Arpeggiator</span>
			</span>
		</Col>
		<Col xs={6} className='text-right'>
			<Button onClick={props.addArp}>Add New <i className='fa fa-plus'></i></Button>
		</Col>
	</Row>
)
