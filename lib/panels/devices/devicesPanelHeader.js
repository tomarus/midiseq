import React from 'react'
import {ButtonGroup, Button, Col} from 'react-bootstrap'
import {connect} from 'react-redux'

import {refreshMidiAction} from 'lib/store/midi'

const mapDispatchToProps = (dispatch) => ({
	handleRefresh () { dispatch(refreshMidiAction()) }
})

export default connect(null, mapDispatchToProps)((props) =>
	<div className='row no-gutter'>
		<Col xs={6}><span className='panel-header'>Devices</span></Col>
		<Col xs={6}>
			<div className='text-right'>
				<ButtonGroup bsSize='xsmall'>
					<Button onClick={props.handleRefresh}><i className='fa fa-refresh'></i></Button>
				</ButtonGroup>
			</div>
		</Col>
	</div>
)
