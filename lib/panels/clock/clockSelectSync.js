import React from 'react'
import {Col, ControlLabel, FormControl, FormGroup, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import {clock} from 'lib/midi/clock'

const mapStateToProps = (state) => ({
	sync: state.midi.syncMode
})

export default connect(mapStateToProps)((props) =>
	<Row>
		<Col componentClass={ControlLabel} sm={4}>
			<ControlLabel>Sync</ControlLabel>
		</Col>
		<Col sm={8}>
			<FormGroup>
				<FormControl componentClass='select' value={props.sync}
					onChange={(e) => { props.onChange(parseInt(e.target.value, 10)) }}>
					{Object.keys(clock.SyncMode).map((value, index) =>
						<option key={index} value={index + 1}>{value}</option>
					)}
				</FormControl>
			</FormGroup>
		</Col>
	</Row>
)
