import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

import {seqDeleteAction} from 'lib/store/sequencer'

const mapDispatchToProps = (dispatch) => ({
	handleDelete (seq, pos) { dispatch(seqDeleteAction(seq, pos)) }
})

//	<OnOffButton on={props.retrig} bsSize='small'
//		disabled={props.repeat === 1}
//		onClick={(e) => { props.handleRetrig(props.seq, props.index, !props.retrig) }}/>
export default connect(null, mapDispatchToProps)((props) =>
	<Button bsSize='small'
		onClick={(e) => { props.handleDelete(props.seq, props.index) }}>
		<i className={'fa fa-fw fa-trash-o'}></i>
	</Button>
)
