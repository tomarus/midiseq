import React from 'react'
import {Button, Col, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import {addRouteAction} from 'lib/store/router'

const mapDispatchToProps = (dispatch) => ({
	addRow () { dispatch(addRouteAction()) }
})

export default connect(null, mapDispatchToProps)((props) =>
	<Row>
		<Col xs={6}>
			<span className='panel-header'>Router</span>
		</Col>
		<Col xs={6} className='text-right'>
			<Button onClick={props.addRow}>Add route <i className='fa fa-plus'></i></Button>
		</Col>
	</Row>
)
