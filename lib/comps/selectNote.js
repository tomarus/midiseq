import React from 'react'
import {Button, ButtonGroup, Form, FormControl, FormGroup} from 'react-bootstrap'

import {Note} from 'lib/midi/util'

export default class extends React.Component {
	static propTypes = {
		note: React.PropTypes.number,
		onChange: React.PropTypes.func
	}

	state = {
		notes: [],
		note: 48
	}

	componentDidMount () {
		let notes = []
		for (let i = 127; i >= 0; i--) {
			notes.push((<option key={i} value={i}>{Note(i)}</option>))
		}
		this.setState({notes, note: this.props.note})
	}

	componentWillReceiveProps (props) {
		if (props.note !== this.state.note) {
			this.setState({note: props.note})
		}
	}

	setNote (note) {
		if (note < 0 || note > 127) return
		this.setState({note})
		this.props.onChange(note)
	}

	handleChange = (event) => {
		let note = parseInt(event.target.value, 10)
		this.setNote(note)
	}

	handleMinus = () => {
		this.setNote(this.state.note - 1)
	}

	handleMinusMinus = () => {
		this.setNote(this.state.note - 12)
	}

	handlePlus = () => {
		this.setNote(this.state.note + 1)
	}

	handlePlusPlus = () => {
		this.setNote(this.state.note + 12)
	}

	render () {
		return (
			<Form inline>
				<ButtonGroup>
					<FormGroup controlID='note'>
						<Button bsSize='small' onClick={this.handleMinusMinus}><i className='fa fa-fw fa-minus'></i></Button>
						<Button bsSize='small' onClick={this.handleMinus}><i className='fa fa-fw'>-</i></Button>
						<FormControl className='square' componentClass='select' value={this.state.note} onChange={this.handleChange}>
							{this.state.notes}
						</FormControl>
						<Button bsSize='small' onClick={this.handlePlus}><i className='fa fa-fw'>+</i></Button>
						<Button bsSize='small' onClick={this.handlePlusPlus}><i className='fa fa-fw fa-plus'></i></Button>
					</FormGroup>
				</ButtonGroup>
			</Form>
		)
	}
}
