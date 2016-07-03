import React from 'react'
import {connect} from 'react-redux'

import {clock} from 'lib/midi/clock'

const mapStateToProps = (state) => {
	return {
		inbpm: state.midi.inbpm
	}
}

@connect(mapStateToProps)
export default class extends React.Component {
	static propTypes = {
		inbpm: React.PropTypes.number
	}

	state = {
		count: 0 // total ticks playing
	}

	componentDidMount () {
		clock.AddListener(this)
	}

	componentWillUnmount () {
		clock.RemoveListener(this)
	}

	// clock interface

	Tick = (msg) => {
		this.setState({count: this.state.count + 1})
	}

	Play = () => {
		this.setState({count: 0})
	}

	render () {
		return (<div>
			Received BPM: {this.props.inbpm.toFixed(1)}<br/>
			Tick Count: {this.state.count}<br/>
		</div>)
	}
}
