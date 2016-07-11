import React from 'react'
import {connect} from 'react-redux'
import {Form, FormControl, FormGroup} from 'react-bootstrap'

import {seqSetArpAction} from 'lib/store/sequencer'

const mapStateToProps = (state, props) => ({
	arp: state.sequencer.seq[parseInt(props.seq, 10)].sequence[parseInt(props.index, 10)].arp,
	retrig: state.sequencer.seq[parseInt(props.seq, 10)].sequence[parseInt(props.index, 10)].retrig,
	repeat: state.sequencer.seq[parseInt(props.seq, 10)].sequence[parseInt(props.index, 10)].repeat,
	arps: state.sequencer.arps
})

const mapDispatchToProps = (dispatch) => ({
	onChange (seq, pos, arp) { dispatch(seqSetArpAction(seq, pos, arp)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<Form inline>
		<FormGroup>
			<FormControl componentClass='select' value={props.arp} className='square'
				disabled={!props.retrig || props.repeat === 1}
				onChange={(e) => { props.onChange(props.seq, props.index, e.target.value) }}>
				<option key='none' value=''>None</option>
				{Object.keys(props.arps).map((key) =>
					<option key={key} value={key}>{key}</option>
				)}
			</FormControl>
		</FormGroup>
	</Form>
)
