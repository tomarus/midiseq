import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'

export default (props) =>
	<FormGroup bsSize={props.bsSize}>
		<FormControl componentClass='select' value={props.value}
			onChange={(e) => { props.onChange(props.index, parseInt(e.target.value, 10)) }}>
			{[...Array(24).keys()].map((index) =>
				<option key={index + 1} value={index + 1}>{index + 1}</option>
			)}
			<option key={48} value={48}>{48}</option>
			<option key={96} value={96}>{96}</option>
			<option key={192} value={192}>{192}</option>
			<option key={384} value={384}>{384}</option>
			<option key={768} value={768}>{768}</option>
		</FormControl>
	</FormGroup>
