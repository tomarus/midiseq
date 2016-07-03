console.log('Launching app..')

import React from 'react'
import ReactDOM from 'react-dom'
import {Route, Router} from 'react-router'
import {Provider} from 'react-redux'

import store from 'lib/store/store'

import Homepage from 'lib/home'

import 'css/main.less!less'

import { useRouterHistory } from 'react-router'
import { createHashHistory } from 'history'
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

import {InitMIDI} from 'lib/midi/midi'
InitMIDI(store)

ReactDOM.render(
	<Provider store={store}>
		<Router history={appHistory}>
			<Route path='/' component={Homepage}/>
		</Router>
	</Provider>, document.getElementById('react-div'))
