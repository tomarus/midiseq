import React from 'react'
import {Panel, Tab, Tabs} from 'react-bootstrap'
import {connect} from 'react-redux'

import Sortable from 'lib/util/sortable'
import DevicesOutputTable from 'lib/panels/devices/devicesOutputTable'
import DevicesPanelHeader from 'lib/panels/devices/devicesPanelHeader'

const headers = [
	{ id: 'hex', name: 'ID' },
	{ id: 'manufacturer', name: 'Manufacturer' },
	{ id: 'name', name: 'Name' }
]

const mapStateToProps = (state) => {
	return {
		inputs: state.midi.inputs
	}
}

export default connect(mapStateToProps)((props) =>
	<div>
		<Panel header={<DevicesPanelHeader/>}>
			<Tabs defaultActiveKey={1} animation={false} id='noanim-tab-example' fill>
				<Tab eventKey={1} title='Outputs'>
					<DevicesOutputTable/>
				</Tab>
				<Tab eventKey={2} title='Inputs'>
					<Sortable rows={props.inputs} headers={headers}/>
				</Tab>
			</Tabs>
		</Panel>
	</div>
)
