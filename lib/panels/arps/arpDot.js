import React from 'react'
import {Button} from 'react-bootstrap'
import {connect} from 'react-redux'

const mapStateToProps = (state, props) => ({
	active: state.sequencer.arps[props.index].active[props.pos]
})

export default connect(mapStateToProps)((props) =>
	<Button bsSize='small' bsStyle={props.active ? 'danger' : 'default'}>
		<i className={props.active ? 'fa fa-circle' : 'fa fa-circle-thin text-default'}></i>
	</Button>
)
