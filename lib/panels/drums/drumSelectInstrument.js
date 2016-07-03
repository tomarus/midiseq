import React from 'react'
import {FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {setInstrumentAction} from 'lib/store/drums'
import data from 'lib/midi/data'

const mapStateToProps = (state, props) => ({
	instr: state.drums.rows[parseInt(props.index, 10)].instr
})

const mapDispatchToProps = (dispatch) => ({
	onChange (index, instr) { dispatch(setInstrumentAction(index, instr)) }
})

export default connect(mapStateToProps, mapDispatchToProps)((props) =>
	<FormGroup>
		<FormControl componentClass='select' value={props.instr}
			onChange={(e) => { props.onChange(props.index, parseInt(e.target.value, 10)) }}>
			{data.GMPercussion.map((value, index) =>
				<option key={index + 35} value={index + 35}>{value}</option>
			)}
		</FormControl>
	</FormGroup>
)
