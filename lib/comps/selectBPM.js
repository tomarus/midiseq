import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'

export default (props) =>
	<FormGroup bsSize={props.bsSize}>
		<FormControl componentClass='select' value={props.value}
			onChange={(e) => { props.onChange(parseInt(e.target.value, 10)) }}>
			{[...Array(200).keys()].map((index) =>
				<option key={index + 40} value={index + 40}>{index + 40}</option>
			)}
		</FormControl>
	</FormGroup>
