import React from 'react'
import {Button} from 'react-bootstrap'

export default (props) =>
	<Button bsStyle={props.muted ? 'danger' : 'success'} bsSize={props.bsSize}
		onClick={props.onClick}>
		<i className={props.muted ? 'fa fa-fw fa-volume-off' : 'fa fa-fw fa-volume-up'}></i>
	</Button>
