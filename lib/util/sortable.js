import React from 'react'
import {Pagination, Table} from 'react-bootstrap'
//
// Based on: https://github.com/brettdewoody/react-easy-sortable-table
// But almost completely rewritten after all.
//
// Use like this:
//
// handleSelect = (ids) => {
// 	console.log('Selected IDs')
// 	console.log(ids)
// }
// render () {
// 	let headers = [
// 		{ id: 'id', name: 'ID' },
// 		{ id: 'name', name: 'Name' },
// 		{ id: 'formatted', sortId: 'value', name: 'Total Amount', className: 'text-right' }
// 	]
// 	let rows = [
// 		{ id: 5, name: 'tommy', value: 1.0, formatted: '$1,00' },
// 		{ id: 9, name: 'pietje', value: 2.0, formatted: '$2,00' },
// 		{ id: 19, name: (<b>Boldie</b>), value: 10.0, formatted: '$10,00' }
// 	]
// 	return (
// 		<Sortable rows={rows} headers={headers} selectHandler={this.handleSelect}/>
// 	)
// }

export default class Sortable extends React.Component {
	static propTypes = {
		headers: React.PropTypes.array.isRequired,
		rows: React.PropTypes.array.isRequired,
		selectHandler: React.PropTypes.func,
		defaultSort: React.PropTypes.string,
		defaultOrder: React.PropTypes.string,
		pageSize: React.PropTypes.number,
		noHeader: React.PropTypes.bool,
		className: React.PropTypes.string,
		noStriped: React.PropTypes.bool
	}

	state = {
		data: [],
		sortDir: {},
		allChecked: false,
		sortColumn: '',
		currentPage: 1
	}

	componentDidMount () {
		if (this.props !== undefined && this.props.rows !== undefined) {
			this.props.rows.map((x) => { x.isChecked = false })
		}
		this.resort(this.props.rows)
	}

	componentWillReceiveProps (newprops) {
		if (newprops.rows === this.props.rows) {
			return
		}
		if (newprops !== undefined) {
			if (this.selectedIDs !== undefined && this.selectedIDs.length > 0) {
				newprops.rows.map((x) => {
					let checked = false
					this.selectedIDs.map((id) => {
						if (id === x.id) { checked = true }
					})
					x.isChecked = checked
				})
			}
			this.resort(newprops.rows)
		}
	}

	sortByColumn (array, column, sortDir) {
		if (column === '') {
			return array
		}
		let sortcol = column
		this.props.headers.map((row) => {
			if (row.id === column && row.sortId !== undefined) { sortcol = row.sortId }
		})
		return array.sort(function (a, b) {
			let x = a[sortcol]
			let y = b[sortcol]
			// sort by ID if checked values are the same
			let res = (a.id > b.id) ? -1 : ((a.id < b.id) ? 1 : 0)
			if (sortDir === 'dsc') {
				return ((x > y) ? -1 : ((x < y) ? 1 : res))
			} else {
				return ((x < y) ? -1 : ((x > y) ? 1 : res))
			}
		})
	}

	resort (data) {
		let sortDir = this.state.sortDir
		let column = this.state.sortColumn

		if (data.length === 0) {
			this.setState({data})
			return
		}

		// Use default sorting if not sorted already.
		if (column === '' && (this.props.defaultSort !== undefined && this.props.defaultOrder !== undefined)) {
			column = this.props.defaultSort
			sortDir[column] = this.props.defaultOrder
		}

		let sortedData = this.sortByColumn(data, column, sortDir[column])
		this.setState({data: sortedData, sortDir: sortDir, sortColumn: column})
	}

	sort = (column) => {
		var sortDir = this.state.sortDir
		sortDir[column] = (sortDir[column] === 'asc' ? 'dsc' : 'asc')
		var sortedData = this.sortByColumn(this.state.data, column, sortDir[column])
		this.setState({data: sortedData, sortDir: sortDir, sortColumn: column})
	}

	updateSelected () {
		if (!this.props.selectHandler) return
		// Create new array of only selected ID's. (FIXME "id" is hardcoded)
		let activeOIDs = []
		this.state.data.map((row, i) => { if (row.isChecked) activeOIDs.push(row.id) })
		this.selectedIDs = activeOIDs
		this.props.selectHandler(activeOIDs)
	}

	onKey = (k) => {
		this.shiftKey = k.shiftKey
	}

	handleSelect = (i) => {
		let data = this.state.data
		data[i].isChecked = !data[i].isChecked
		// Handle shift-click to select multiple.
		if (this.shiftKey) {
			let start = this.lastCheck > i ? i : this.lastCheck
			let end = this.lastCheck > i ? this.lastCheck : i
			for (let n = start; n < end; n++) {
				data[n].isChecked = data[i].isChecked
			}
		}
		this.lastCheck = i
		this.setState({data: data})
		this.updateSelected()
	}

	handleSelectAll = () => {
		this.state.data.map((row, i) => { if (!row.hide) row.isChecked = !this.state.allChecked })
		this.setState({ allChecked: !this.state.allChecked })
		this.updateSelected()
		this.forceUpdate()
	}

	handlePageSelect = (e) => {
		this.setState({currentPage: e})
	}

	render () {
		var data = this.state.data
		if (data === undefined) {
			return (<table/>)
		}
		let selectable = this.props.selectHandler !== undefined

		let pagination
		if (this.props.pageSize > 0 && data.length > this.props.pageSize) {
			let pages = data.length / this.props.pageSize + 1
			pagination = (
				<span>Page: <Pagination
					boundaryLinks
					items={pages}
					activePage={this.state.currentPage}
					onSelect={this.handlePageSelect} />
				</span>
			)
			let begin = (this.state.currentPage - 1) * this.props.pageSize
			data = data.slice(begin, begin + this.props.pageSize)
		}

		let hdr
		if (!this.props.noHeader) {
			hdr = (
				<thead>
					<TableHeader onSort={this.sort} headers={this.props.headers} sortDir={this.state.sortDir}
						selectable={selectable} selectHandler={this.handleSelectAll} sorted={this.state.sortColumn}/>
				</thead>
			)
		}

		return (
			<div fill> <Table condensed hover striped={!this.props.noStriped} fill className={this.props.className}>
				{hdr}
				<TableBody data={data} headers={this.props.headers}
					selectable={selectable} selectHandler={this.handleSelect}
					keyHandler={this.onKey}/>
			</Table>
			{pagination}
			</div>
		)
	}
}

class TableHeader extends React.Component {
	static propTypes = {
		sortDir: React.PropTypes.object,
		onSort: React.PropTypes.func,
		headers: React.PropTypes.array,
		selectable: React.PropTypes.bool,
		selectHandler: React.PropTypes.func,
		sorted: React.PropTypes.string
	}

	state = {
		sorted: ''
	}

	componentDidMount () {
		if (this.props.sorted !== '') {
			this.setState({sorted: this.props.sorted})
		}
	}

	componentWillReceiveProps (newprops) {
		if (newprops.sorted !== '') {
			this.setState({sorted: newprops.sorted})
		}
	}

	sort (column) {
		return function (event) {
			this.props.onSort(column)
			this.setState({sorted: column})
		}.bind(this)
	}

	render () {
		let cells = this.props.headers.map((row, i) => {
			if (row.hide) {
				return undefined
			}
			if (row.nosort) {
				return <th key={row.name} className={row.className}>{row.name}</th>
			}
			let icon
			if (this.state.sorted === row.id) {
				let dir = this.props.sortDir[row.id] === 'asc' ? 'fa-caret-up' : 'fa-caret-down'
				let className = 'fa text-danger ' + dir
				icon = (<i className={className}></i>)
			}
			return <th onClick={this.sort(row.id)} key={row.id} className={row.className}>{row.name} {icon}</th>
		})

		let cb
		if (this.props.selectable) {
			cb = <th><input type='checkbox' className='form-inline' onClick={this.props.selectHandler}/></th>
		}

		return (
			<tr key='headerRow'>
				{cb}
				{cells}
			</tr>
		)
	}
}

class TableBody extends React.Component {
	static propTypes = {
		headers: React.PropTypes.array.isRequired,
		data: React.PropTypes.array.isRequired,
		selectable: React.PropTypes.bool,
		selectHandler: React.PropTypes.func,
		keyHandler: React.PropTypes.func
	}

	render () {
		let headers = this.props.headers
		let data = this.props.data

		return (
			<tbody>
				{data.map((item, idx) => {
					if (item.hide) { return undefined }
					return <TableRow key={idx} id={idx} data={item} headers={headers}
						selectable={this.props.selectable} selectHandler={this.props.selectHandler}
						keyHandler={this.props.keyHandler}/>
				})}
			</tbody>
		)
	}
}

class TableRow extends React.Component {
	static propTypes = {
		headers: React.PropTypes.array.isRequired,
		data: React.PropTypes.object.isRequired,
		selectable: React.PropTypes.bool,
		selectHandler: React.PropTypes.func,
		keyHandler: React.PropTypes.func,
		id: React.PropTypes.number
	}

	handleSelect = () => {
		this.props.selectHandler(this.props.id)
	}

	handleKey = (k) => {
		this.props.keyHandler(k)
	}

	render () {
		let data = this.props.data
		let cells = this.props.headers.map((row, i) => {
			if (row.hide) {
				return undefined
			}
			let cn = row.className
			if (data.className !== undefined) {
				cn = data.className
			}
			return <td key={i} className={cn}>{data[row.id]}</td>
		})
		let cb
		if (this.props.selectable) {
			cb = <td><input type='checkbox' className='form-inline'
				checked={data.isChecked}
				onClick={this.handleSelect}
				onKeyUp={this.handleKey} onKeyDown={this.handleKey}
				/></td>
		}

		return (
			<tr key={data}>{cb}{cells}</tr>
		)
	}
}
