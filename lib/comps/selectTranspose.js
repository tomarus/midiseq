import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'

export default ((props) =>
	<FormGroup>
		<FormControl componentClass='select' value={props.transpose}
			onChange={(e) => { props.onChange(props.index, parseInt(e.target.value, 10)) }}>
			{[...Array(48).keys()].map((index) =>
				<option key={index - 24} value={index - 24}>{index - 24}</option>
			)}
		</FormControl>
	</FormGroup>
)
