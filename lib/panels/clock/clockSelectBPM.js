import React from 'react'
import {Col, ControlLabel, FormControl, FormGroup, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import {clock} from 'lib/midi/clock'

const mapStateToProps = (state) => ({
	bpm: state.midi.bpm,
	sync: state.midi.syncMode
})

@connect(mapStateToProps)
export default class extends React.Component {
	render () {
		if (!(this.props.sync === clock.SyncMode.Send || this.props.sync === clock.SyncMode.Ignore)) {
			return (<div/>)
		}

		return (
			<Row>
				<Col componentClass={ControlLabel} sm={4}>
					<ControlLabel>Tempo</ControlLabel>
				</Col>
				<Col sm={8}>
					<FormGroup>
						<FormControl componentClass='select' value={this.props.bpm}
							onChange={(e) => { this.props.onChange(parseInt(e.target.value, 10)) }}>
							{[...Array(200).keys()].map((index) =>
								<option key={index + 40} value={index + 40}>{index + 40}</option>
							)}
						</FormControl>
					</FormGroup>
				</Col>
			</Row>
		)
	}
}
