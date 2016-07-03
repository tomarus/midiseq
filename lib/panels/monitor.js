import React from 'react'
import {Button, ButtonGroup, Col, Panel, Row} from 'react-bootstrap'
import {connect} from 'react-redux'

import {AddListener, RemoveListener} from 'lib/midi/midi'
import {Status, Timestamp} from 'lib/midi/util'
import Sortable from 'lib/util/sortable'

const mapStateToProps = (state) => {
	return {
		inputs: state.midi.inputs
	}
}

@connect(mapStateToProps)
export default class Monitor extends React.Component {
	static propTypes = {
		inputs: React.PropTypes.array
	}

	state = {
		visible: false,
		msgs: [],
		headers: [
			{ id: 'timestamp', name: 'Time' },
			{ id: 'port', name: 'Port' },
			{ id: 'channel', name: 'Channel' },
			{ id: 'type', name: 'Type' },
			{ id: 'bytes', name: 'bytes' }
		]
	}

	componentDidMount () {
		AddListener(this.handleMidiMessage)
	}

	componentWillUnmount () {
		RemoveListener(this.handleMidiMessage)
	}

	handleMidiMessage = (msg) => {
		if (msg.status === 0xf8 || !this.state.visible) {
			return
		}

		let bytes = ''
		for (let i = 0; i < msg.data.length; i++) {
			bytes += '0x' + msg.data[i].toString(16) + ' '
		}
		msg.bytes = bytes
		msg.port = msg.source.name
		msg.timestamp = Timestamp(msg.timestamp)
		msg.type = Status(msg)
		msg.channel += 1 // for display only

		let m = this.state.msgs
		if (m.length > 10) {
			m = m.slice(m.length - 10, m.length)
		}
		m.push(msg)
		this.setState({msgs: m})
	}

	handleRefresh = () => {
		console.log('doei')
	}

	toggleView = () => {
		this.setState({visible: !this.state.visible})
	}

	render () {
		let toggleIcon = this.state.visible ? 'fa fa-minus' : 'fa fa-plus'
		let textClass = this.state.visible ? 'default' : 'text-muted'

		let title = (
			<Row>
				<Col xs={6} className={textClass}>
					<Button onClick={this.toggleView} bsStyle='link'><i className={toggleIcon}></i></Button>
					<span className='panel-header'>Monitor</span>
				</Col>
				<Col xs={6}>
					<div className='text-right'>
					</div>
				</Col>
			</Row>)

		if (!this.state.visible) {
			return (<Panel header={title}/>)
		}

		return (<div>
			<Panel header={title}>
				<Row fill>
					<Col xs={12}>
						<Sortable rows={this.state.msgs} headers={this.state.headers}/>
					</Col>
				</Row>
			</Panel>
		</div>)
	}
}
