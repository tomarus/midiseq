import React from 'react'
import {connect} from 'react-redux'

import Sortable from 'lib/util/sortable'
import DevicesOutputClock from 'lib/panels/devices/devicesOutputClock'
import DevicesOutputSys from 'lib/panels/devices/devicesOutputSys'

const headers = [
	{ id: 'hex', name: 'ID' },
	{ id: 'manufacturer', name: 'Manufacturer' },
	{ id: 'name', name: 'Name' },
	{ id: 'clockOutCheck', name: 'CLK' },
	{ id: 'sysOutCheck', name: 'SYS' }
]

const mapStateToProps = (state) => {
	return {
		outputs: state.midi.outputs.map((out, index) => {
			out.clockOutCheck = (<DevicesOutputClock index={index}/>)
			out.sysOutCheck = (<DevicesOutputSys index={index}/>)
			return out
		})
	}
}

export default connect(mapStateToProps)((props) =>
	<Sortable rows={props.outputs} headers={headers}/>
)
