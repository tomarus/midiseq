import React from 'react'
import {Col, Panel, Row, Table} from 'react-bootstrap'
import {connect} from 'react-redux'

import DrumPanelHeader from 'lib/panels/drums/drumPanelHeader'
import DrumRow from 'lib/panels/drums/drumRow'

const mapStateToProps = (state) => ({
	visible: state.drums.visible,
	rows: state.drums.rows
})

const mapDispatchToProps = (dispatch) => ({
})

@connect(mapStateToProps, mapDispatchToProps)
export default class Drums extends React.Component {
	render () {
		if (!this.props.visible) return (<Panel header={<DrumPanelHeader/>}/>)

		return (
			<Panel header={<DrumPanelHeader/>}>
				<Row fill>
					<Col xs={12}>
						<Table fill condensed>
							<thead>
								<tr><th>Mute</th><th>Instrument</th><th>Trigger</th><th>Length</th><th>Dots</th></tr>
							</thead>
							<tbody>
								{this.props.rows.map((value, index) =>
									<DrumRow key={index} index={index}/>
								)}
							</tbody>
						</Table>
					</Col>
				</Row>
			</Panel>)
	}
}
