import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'

export default ((props) =>
	<FormGroup>
		<FormControl componentClass='select' value={props.port}
			onChange={(e) => { props.onChange(parseInt(e.target.value, 10)) }}>
			{[...Array(props.max).keys()].map((index) =>
				<option key={index} value={index}>{index + 1}</option>
			)}
		</FormControl>
	</FormGroup>
)
