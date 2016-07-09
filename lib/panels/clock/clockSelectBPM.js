import React from 'react'
import {Col, ControlLabel, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import SelectBPM from 'lib/comps/selectBPM'
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
					<SelectBPM value={this.props.bpm}
						onChange={(v) => { this.props.onChange(v) }}/>
				</Col>
			</Row>
		)
	}
}
