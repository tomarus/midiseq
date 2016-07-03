import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

import {seqRetrigAction} from 'lib/store/sequencer'

const mapStateToProps = (state, props) => ({
	repeat: state.sequencer.seq[parseInt(props.seq, 10)].sequence[parseInt(props.index, 10)].repeat,
	retrig: state.sequencer.seq[parseInt(props.seq, 10)].sequence[parseInt(props.index, 10)].retrig
})

const mapDispatchToProps = (dispatch) => ({
	handleRetrig (seq, pos, retrig) { dispatch(seqRetrigAction(seq, pos, retrig)) }
})

//	<OnOffButton on={props.retrig} bsSize='small'
//		disabled={props.repeat === 1}
//		onClick={(e) => { props.handleRetrig(props.seq, props.index, !props.retrig) }}/>
export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Button bsSize='small' bsStyle={props.repeat === 1 ? 'default' : props.retrig ? 'success' : 'default'}
		disabled={props.repeat === 1}
		onClick={(e) => { props.handleRetrig(props.seq, props.index, !props.retrig) }}>
		<i className={props.retrig ? 'fa fa-fw fa-square' : 'fa fa-fw fa-square-o'}></i>
	</Button>
)
