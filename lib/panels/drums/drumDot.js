import React from 'react'
import {Button} from 'react-bootstrap'
import {connect} from 'react-redux'

import {toggleDotAction} from 'lib/store/drums'

const mapStateToProps = (state, props) => ({
	dot: state.drums.rows[parseInt(props.index, 10)].dots[parseInt(props.pos, 10)],
	active: state.drums.players[parseInt(props.index, 10)].active[parseInt(props.pos, 10)]
})

const mapDispatchToProps = (dispatch) => ({
	onClick (index, pos) { dispatch(toggleDotAction(index, pos)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Button bsStyle={props.active ? 'danger' : props.dot ? 'success' : 'default'}
		onClick={() => { props.onClick(props.index, props.pos) }}>
		<i className={props.dot ? 'fa fa-square' : 'fa fa-square-o'}></i>
	</Button>
)
