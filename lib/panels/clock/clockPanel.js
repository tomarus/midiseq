import React from 'react'
import {ButtonGroup, Button, Col, Form, FormGroup, Panel, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import {clock} from 'lib/midi/clock'
import ClockPanelInfo from 'lib/panels/clock/clockPanelInfo'
import ClockSelectBPM from 'lib/panels/clock/clockSelectBPM'
import ClockSelectSync from 'lib/panels/clock/clockSelectSync'

const mapStateToProps = (state) => {
	return {
		playing: state.midi.playing
	}
}

export default connect(mapStateToProps)((props) =>
	<Panel header={(<span className='panel-header'>Clock</span>)}>
		<Row>
			<Col xs={6}>
				<Form>
					<FormGroup controlID='snc'>
						<ClockSelectSync onChange={clock.SetSyncMode}/>
						<ClockSelectBPM onChange={clock.SetBPM}/>
					</FormGroup>
				</Form>
				<ClockPanelInfo/>
			</Col>

			<Col xs={6}>

				<Row>
					<Col xs={12} className='text-right'>
						<ButtonGroup>
							<Button bsSize='large' onClick={clock.Play} bsStyle={props.playing ? 'success' : 'default'}><i className='fa fa-play'></i></Button>
							<Button bsSize='large' onClick={clock.Stop}><i className='fa fa-stop'></i></Button>
						</ButtonGroup>
					</Col>
				</Row>
			</Col>
		</Row>
	</Panel>
)
