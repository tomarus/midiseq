export var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export var shortMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function pad (num, places) {
	let zero = places - num.toString().length + 1
	return Array(+(zero > 0 && zero)).join('0') + num
}

let id = 0
export function uniqueid (prefix = 'id') {
	id++
	return `${prefix}${id}`
}

// formatEpoch formats epoch to YYYY-MM-DD
export function formatEpoch (epoch) {
	let sd = new Date(epoch * 1000)
	return sd.getFullYear() + '-' + pad(sd.getMonth() + 1, 2) + '-' + pad(sd.getDate(), 2)
}

// formatBytes formats not only bytes, but everything.
// Use like: formatBytes(123456789, 2, 1000, '', '')
// Or:       formatBytes(123456789, 3, 1024, 'bytes', 'b')
export function formatBytes (bytes, decimals, k, s1, s2) {
	if (bytes === 0) return '0 ' + s1
	var dm = decimals || 3
	var sizes = [s1, 'K' + s2, 'M' + s2, 'G' + s2, 'T' + s2, 'P' + s2]
	var i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i))).toFixed(dm) + ' ' + sizes[i]
}

// dynamicSort sorts an array of objects given it's key. Use -id for reverse sort.
export function dynamicSort (prop) {
	let sortOrder = 1
	if (prop[0] === '-') {
		sortOrder = -1
		prop = prop.substr(1)
	}
	return function (a, b) {
		var result = (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0
		return result * sortOrder
	}
}

// History stuff

import createHashHistory from 'history/lib/createHashHistory'
export var history = createHashHistory({ queryKey: false })

// location is our current history object.
export var location
history.listen((e) => {
	location = e
})
