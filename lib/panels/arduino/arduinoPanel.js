import React from 'react'
import {Button, Panel, Table} from 'react-bootstrap'
import {connect} from 'react-redux'

import SelectBPM from 'lib/comps/selectBPM'
import arduino from 'lib/midi/arduino'
import ArduinoPanelHeader from 'lib/panels/arduino/arduinoPanelHeader'
import ArduinoRow from 'lib/panels/arduino/arduinoRow'

const mapStateToProps = (state) => {
	return {
		available: state.arduino.available,
		bpm: state.arduino.bpm,
		len: state.arduino.routes.length
	}
}

const mapDispatchToProps = (dispatch) => ({
	Scan () { arduino.Scan() },
	SetBPM (bpm) { arduino.SetBPM(bpm) }
})

const MainPanel = connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Panel header={<ArduinoPanelHeader/>}>
		<Table condensed>
			<tbody>
				<tr>
					<td>Clock Speed</td>
					<td>
						<SelectBPM value={props.bpm}
							onChange={(v) => { props.SetBPM(v) }}/>
					</td>
				</tr>
			</tbody>
		</Table>

		<Table fill condensed>
			<thead>
				<tr>
					<th>On</th>
					<th>In Port</th>
					<th>In Channel</th>
					<th>Out Port</th>
					<th>Out Channel</th>
					<th>Transpose</th>
					<th>Del</th>
				</tr>
			</thead>
			<tbody>
			{[...Array(props.len).keys()].map((index) =>
				<ArduinoRow key={index} index={index}/>
			)}
			</tbody>
		</Table>

		<Table fill condensed>
			<thead>
				<tr>
					<th>On</th>
					<th>Out Port</th>
					<th>Out Channel</th>
					<th>NRPM MSB</th>
					<th>LSB</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</Table>
	</Panel>
)

const ScanPanel = connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Panel header={<span className='panel-header'>Arduino Controller</span>}>
		<p className='text-muted'>
			This will try to locate an Arduino Controller on any of the available MIDI ports.
			See <a href='https://github.com/tomarus/arduino-midi'>this link</a> for more information.
		</p>
		<Button onClick={props.Scan}>Scan for Arduino</Button>
	</Panel>
)

@connect(mapStateToProps, mapDispatchToProps)
export default class Drums extends React.Component {
	render () {
		if (this.props.available) {
			return (<MainPanel/>)
		} else {
			return (<ScanPanel/>)
		}
	}
}
