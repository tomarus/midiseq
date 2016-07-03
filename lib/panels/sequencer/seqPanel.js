import React from 'react'
import {Col, Panel, Row, Table} from 'react-bootstrap'
import {connect} from 'react-redux'

import SequencerRow from 'lib/panels/sequencer/seqRow'
import SequencerPanelHeader from 'lib/panels/sequencer/seqPanelHeader'

const mapStateToProps = (state, props) => {
	return {
		visible: state.sequencer.seq[props.seq].visible,
		sequence: state.sequencer.seq[props.seq].sequence
	}
}

@connect(mapStateToProps)
export default class Sequencer extends React.Component {
	render () {
		if (!this.props.visible) {
			return (<Panel header={<SequencerPanelHeader seq={this.props.seq}/>}/>)
		}

		return (<div>
			<Panel header={<SequencerPanelHeader seq={this.props.seq}/>}>
				<Row fill>
					<Col xs={12}>
						<Table fill condensed>
							<thead>
								<tr><th>Pos</th><th>Note</th><th>Repeat</th><th>Retrig</th><th>Velocity</th><th>Len</th></tr>
							</thead>
							<tbody>
								{this.props.sequence.map((row, i) =>
									<SequencerRow seq={this.props.seq} index={i} key={i}/>
								)}
							</tbody>
						</Table>
					</Col>
				</Row>
			</Panel>
		</div>)
	}
}
