import React from 'react'
import {Panel, Table} from 'react-bootstrap'
import {connect} from 'react-redux'

import ArpsPanelHeader from 'lib/panels/arps/arpsPanelHeader'
import ArpRow from 'lib/panels/arps/arpRow'

const mapStateToProps = (state) => {
	return {
		arps: state.sequencer.arps,
		visible: state.sequencer.arpvisible
	}
}

@connect(mapStateToProps)
export default class extends React.Component {
	render () {
		if (!this.props.visible) return (<Panel header={<ArpsPanelHeader/>}/>)

		let max = 0
		Object.keys(this.props.arps).map((index) => {
			let n = this.props.arps[index].offsets.length
			max = n > max ? n : max
		})

		return (
			<Panel header={<ArpsPanelHeader/>}>
				<Table fill condensed>
					<thead>
						<tr>
							<th>Name</th>
							<th>Trigger</th>
							{[...Array(max).keys()].map((key, n) =>
								<th key={n}>{n}</th>
							)}
							<th>Add</th>
						</tr>
					</thead>
					<tbody>
						{Object.keys(this.props.arps).map((key) =>
							<ArpRow key={key} index={key} max={max}/>
						)}
					</tbody>
				</Table>
			</Panel>
		)
	}
}
