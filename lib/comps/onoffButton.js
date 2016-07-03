import React from 'react'
import {Button} from 'react-bootstrap'

export default (props) =>
	<Button bsSize={props.bsSize} bsStyle={props.on ? 'success' : 'default'}
		onClick={props.onClick} disabled={props.disabled}>
		<i className={props.on ? 'fa fa-fw fa-square' : 'fa fa-fw fa-square-o'}></i>
	</Button>
