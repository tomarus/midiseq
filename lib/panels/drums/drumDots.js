import React from 'react'
import {ButtonGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import DrumDot from 'lib/panels/drums/drumDot'

const mapStateToProps = (state, props) => ({
	len: state.drums.rows[parseInt(props.index, 10)].len
})

export default connect(mapStateToProps)((props) =>
	<ButtonGroup>
		{[...Array(props.len).keys()].map((index) =>
			<DrumDot key={index} index={props.index} pos={index}/>
		)}
	</ButtonGroup>
)
