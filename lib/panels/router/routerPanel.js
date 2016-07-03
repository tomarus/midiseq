import React from 'react'
import {Panel, Table} from 'react-bootstrap'
import {connect} from 'react-redux'

import RouterPanelHeader from 'lib/panels/router/routerPanelHeader'
import RouterRow from 'lib/panels/router/routerRow'

const mapStateToProps = (state) => {
	return {
		len: state.router.routes.length
	}
}

export default connect(mapStateToProps)((props) =>
	<Panel header={<RouterPanelHeader/>}>
		<Table fill>
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
				<RouterRow key={index} index={index}/>
			)}
			</tbody>
		</Table>
	</Panel>
)
