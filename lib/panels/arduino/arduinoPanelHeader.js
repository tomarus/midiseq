import React from 'react'
import {Button, Col, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import {addRouteAction} from 'lib/store/arduino'

const mapStateToProps = (state) => ({
	version: state.arduino.version
})

const mapDispatchToProps = (dispatch) => ({
	addRow () { dispatch(addRouteAction()) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Row>
		<Col xs={6}>
			<span className='panel-header'>Arduino Controller v{props.version}</span>
		</Col>
		<Col xs={6} className='text-right'>
			<Button onClick={props.addRow}>Add <i className='fa fa-plus'></i></Button>
		</Col>
	</Row>
)
