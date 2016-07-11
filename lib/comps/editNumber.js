import React from 'react'
import {Button, Form, FormControl, FormGroup, InputGroup} from 'react-bootstrap'

export default class extends React.Component {
	static propTypes = {
		disabled: React.PropTypes.bool,
		value: React.PropTypes.number,
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		onChange: React.PropTypes.func.isRequired
	}

	static defaultProps = {
		min: 1
	}

	state = {
		value: this.props.value
	}

	componentWillReceiveProps (props) {
		this.setState({value: props.value})
	}

	setValue (value) {
		if (value < this.props.min || (this.props.max && value > this.props.max)) return
		this.setState({value})
		this.props.onChange(value)
	}

	handlePlus = () => {
		this.setValue(this.state.value + 1)
	}

	handleMinus = () => {
		this.setValue(this.state.value - 1)
	}

	handleChange = (e) => {
		let v = parseInt(e.target.value, 10)
		this.setValue(v)
	}

	render () {
		return (<Form inline>
			<FormGroup bsSize='small'>
				<InputGroup bsize='small' className='form-control-inline'>
					<FormControl type='text' bsSize='small' value={this.state.value} onChange={this.handleChange} disabled={this.props.disabled}/>
					<InputGroup.Button>
						<Button bsSize='xsmall' onClick={this.handleMinus} disabled={this.props.disabled}>
							-
						</Button>
						<Button bsSize='xsmall' onClick={this.handlePlus} disabled={this.props.disabled}>
							+
						</Button>
					</InputGroup.Button>
				</InputGroup>
			</FormGroup>
		</Form>)
	}
}
