import { dev } from '$app/env';

const SYMBOLS = 7 // Must match number of symbol classes in Symbol.svelte
const MIN_EVENT_WIDTH = 3
const DAYS_IN_MONTH = [
	31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
]
const DATE_BEFORE = -1


// https://materialui.co/colors
// 500 unless otherwise stated
const COLOUR_SET = [
	'var(--material-600-red)',
	'var(--material-400-indigo)',
	'var(--material-500-teal)',
	'var(--material-600-light-green)',
	'var(--material-500-amber)',
	'var(--material-300-brown)',
	'var(--material-500-blue-grey)',
	'var(--material-700-cyan)',
	'var(--material-700-orange)'
]


const colour = function (index, colourIndex, group) {
	if (group) {
		index = colourIndex
	}
	return COLOUR_SET[index % COLOUR_SET.length]
}


const toPrecision = function (num, digits) {
	return parseFloat(num.toPrecision(digits))
}


const findNormalisedMin = function (step, min) {
	let y = 0
	// debugger
	if (min < 0) {
		while (y > min) {
			y -= step
		}
	} else {
		while (y < min) {
			y += step
		}
	}
	return y
}


const formatNumber = function (number, digits = 0) {
	let suffix = ''
	if (number > 1000000) {
		number = number / 1000000
		suffix = 'M'
	}
	if (digits == 0) {
		return new Intl.NumberFormat('en-GB').format(number) + suffix
	}
	return new Intl.NumberFormat('en-GB', { maximumSignificantDigits: digits }).format(number) + suffix
}


const formatDate = function (date) {
	let formatted = formatYear(date.year)
	if (date.month > 0 && date.day > 0) {
		formatted = `${date.day} ${getMonth(date.month)} ${formatted}`
	}
	return formatted
}


const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getMonth = function (m) {
	return MONTHS[parseInt(m) - 1]
}


const formatYear = function (year) {
	const magnitude = Math.abs(year)
	let millions = magnitude / 1000000
	let thousands = millions * 1000
	// let formatted = new Intl.NumberFormat().format(Math.round(millions))
	// console.log(year,magnitude,millions,thousands,formatted)

	if (millions > 1) {

		// let formatted = new Intl.NumberFormat().format(Math.round(millions))
		let formatted = Number.parseFloat(millions).toPrecision(2)
		formatted = new Intl.NumberFormat().format(formatted)

		if (year < 0) {
			return formatted + 'mya'
		}
		return formatted + 'my'

	} else if (thousands > 10) {

		// let formatted = Number.parseFloat(millions).toPrecision(1)
		// if ( year < 0 ){
		// 	return formatted + 'mya'
		// }
		// return formatted + 'my'

		// let formatted = Number.parseFloat(thousands).toPrecision(2)
		let formatted = parseInt(thousands / 100) * 100
		if (year < 0) {
			return formatted + 'tya'
		}
		return formatted + 'ty'

	} else if (year < 0) {
		return Math.abs(year) + 'bc'
	}

	return year
}



const eventDates = function (event) {
	// debugger
	let html = ''
	if (event.start != '-') {
		html += formatDate(event.startDate)
	}
	if (event.end) {
		if (event.end == '-') {
			html += ' - '
		} else {
			html += ` - ${formatDate(event.endDate)}`
		}
	}
	html = `(${html})`
	return html
}


const initXAxis = function (xUnit, start, end) {
	// const s = start.year ? start.year : start
	// const e = end.year ? end.year : end
	const s = start.year
	const e = end.year
	const axis = {
		majorAxis: [],
		majorTicks: [],
		majorLabels: [],
		majorFirst: s,
		majorLast: e,
		majorRange: e - s,
		xUnit
	}
	console.log('new axis', axis)
	return axis
}


const initSettings = function (userSettings, start, end, subCats) {
	let settings = {}
	// Apply default settings where required
	settings.symbols = userSettings.symbols || false
	settings.readonly = userSettings.readonly || false
	settings.totalise = userSettings.totalise || false
	settings.categorise = userSettings.categorise || false
	settings.logscale = userSettings.logscale || false
	settings.search = userSettings.search || ''
	settings.filter = userSettings.filter || ''
	settings.title = userSettings.title || ''
	settings.sort = userSettings.sort || 'x'
	// if ( userSettings.xRange && userSettings.xRange.start && userSettings.xRange.end ){
	if (userSettings?.xRange.end !== undefined) {
		settings.xRange = userSettings.xRange
		if (userSettings.xRange.start.year && userSettings.xRange.end.year) {
			settings.xRange.range = userSettings.xRange.end.year - userSettings.xRange.start.year
		} else {
			settings.xRange.range = userSettings.xRange.end - userSettings.xRange.start
		}
	} else {
		const s = start.year ? start.year : start
		const e = end.year ? end.year : end
		settings.xRange = {
			start: s,
			end: e,
			range: e - s
		}
	}

	settings.subCats = userSettings.subCats.length > 0 ? userSettings.subCats : subCats
	// console.log('userSettings.subCats', userSettings.subCats, 'subCats', subCats, 'subCats,settings.subCats', settings.subCats)
	return settings
}


const initCategories = function (events, series) {

	// console.log('creating new group from series', series)
	let groups = []

	// Get two lists of unique sub categories
	let seriesSubCats = new Set
	series.forEach(entry => {
		seriesSubCats.add(entry.subCategory)
	})

	let eventsSubCats = new Set
	events.forEach(entry => {
		eventsSubCats.add(entry.subCategory)
	})

	seriesSubCats = Array.from(seriesSubCats)
	eventsSubCats = Array.from(eventsSubCats)

	// Sort and add extra full total group for series
	if (seriesSubCats.length > 1) {
		seriesSubCats.sort((a, b) => a - b)
		seriesSubCats.push('total')
	}

	// Generate totalised sub category groups
	if (series.length > 0) {

		seriesSubCats.forEach((cat, index) => {

			let group = {
				id: index + 1,
				max: Number.NEGATIVE_INFINITY,
				min: Number.POSITIVE_INFINITY,
				name: cat,
				points: [],
				subCategory: cat,
				citations: ''
			}

			series.forEach(item => {

				group.xUnit = item.xUnit
				group.citations = item.citations

				if (cat == 'total' || item.subCategory == cat) {

					item.points.forEach(point => {

						// Look for point with same x
						let match = group.points.findIndex(pt => pt.x == point.x)

						// Create new point or add existing to match
						if (group.points.length == 0 || match == -1) {
							match = 0
							// *** IMPORTANT *** MUST PUSH A COPY NOT THE ORIGINAL
							group.points.push({ ...point })
						} else {
							group.points[match].value += point.value
						}

						if (group.points[match].value > group.max) {
							group.max = group.points[match].value
						}
						if (group.points[match].value < group.min) {
							group.min = group.points[match].value
						}

					})
				}
			})

			group.points.sort((a, b) => a.x - b.x)

			groups.push(group)
		})

	}

	//console.error('groups',groups,'subcats',subCats)
	return { groups, eventsSubCats, seriesSubCats }
}


const initSeriesColours = function (series, groups) {
	const indices = []
	series.forEach((entry, index) => {
		let subCatIndex = index
		if (entry.subCategory != '') {
			subCatIndex = indices.findIndex(cat => cat == entry.subCategory)
			if (subCatIndex == -1) {
				indices.push(entry.subCategory)
				subCatIndex = indices.length - 1
			}
		}
		entry.colourIndex = subCatIndex % COLOUR_SET.length
		entry.symbolIndex = index % SYMBOLS
	})
	groups.forEach((entry, index) => {
		let subCatIndex = index
		if (entry.subCategory != '') {
			subCatIndex = indices.findIndex(cat => cat == entry.subCategory)
			if (subCatIndex == -1) {
				indices.push(entry.subCategory)
				subCatIndex = indices.length - 1
			}
		}
		entry.colourIndex = subCatIndex % COLOUR_SET.length
		entry.symbolIndex = index % SYMBOLS
	})

	// console.log('series',series)

	return { series, groups }
}


const processDataset = function (data) {
	// Init extremes
	data.start = false
	data.end = false
	// Convert end string dates to date objects and find extremes
	data.events.forEach((event) => {
		// Start date
		if (event.start !== '-') {
			event.start = getDateParts(event.start)
			if (!data.start ||
				compareDates(event.start, data.start) == DATE_BEFORE) {
				data.start = event.start
			}
			// // Optional end date
			// if (event?.end) {
			// 	event.end = getDateParts(event.end)
			// }
		}
		// Optional end date
		if (event.end !== undefined) {
			if (event.end !== '-') {
				event.end = getDateParts(event.end)
				if (event.end) {
					if (!data.end || compareDates(data.end, event.end) == DATE_BEFORE) {
						data.end = event.end
					}
				} else {
					if (!data.start || compareDates(data.start, event.end) == DATE_BEFORE) {
						data.end = event.start
					}
				}
			}
		}
	})

	data.end.year = data.start.year + Math.round((data.end.year - data.start.year) * 1.02)
	data.end.month = 0
	data.end.day = 0
	data.end.decimal = data.end.year

	console.log('dataset', data)

	data.xAxis = initXAxis(data.xUnit, data.start, data.end)

	const groupsAndSubCats = initCategories(data.events, data.series)
	data.eventsSubCats = groupsAndSubCats.eventsSubCats
	data.seriesSubCats = groupsAndSubCats.seriesSubCats
	const seriesAndGroups = initSeriesColours(data.series, groupsAndSubCats.groups)
	data.series = seriesAndGroups.series
	data.groups = seriesAndGroups.groups
	return data
}


const processEvents = function (events, scale, startValue, endValue, datasetSubCats, optionsSubCats, search) {

	console.log('start value', startValue, 'endValue', endValue)
	// console.warn('\nProcessing events', events, '\ndatasetSubCats', datasetSubCats, '\noptionsSubCats', optionsSubCats, '\nsearch', search)

	let filtered = filterEventsBySearchAndCategory(events, search, optionsSubCats)
	// console.log('filtered', [...filtered])

	filtered = filterEventsByXRange(filtered, scale, startValue, endValue, datasetSubCats)
	// console.log('filtered', [...filtered])

	return sortEventsVertically(filtered, datasetSubCats)
}


const filterEventsBySearchAndCategory = function (events, search, optionsSubCats) {
	const pattern = new RegExp(search, 'i')
	let filtered = []
	events.forEach(event => {
		let matched = search == '' || event.name.search(pattern) != -1
		if (matched && optionsSubCats.includes(event.subCategory)) {
			filtered.push(event)
		}
	})
	return filtered
}

const filterEventsByXRange = function (events, scale, startValue, endValue, datasetSubCats) {
	let filtered = []
	// let started = false
	// let ongoing = false
	// let startsIn = false
	// let endsIn = false
	// let start = false
	// let end = false

	events.forEach((event, index) => {

		// debugger

		// if (event.id == 63) {
		// 	debugger
		// }

		const startsIn =
			// Already started or ...
			event.start === '-' ||
			// ... started after reference startValue &&
			(event.start.decimal >= startValue &&
				// ... no end, or ongoing or start before end
				(event.end === undefined || event.end === '-' || event.start.decimal <= event.end.decimal))

		const endsIn =
			// Starts in and ...
			startsIn &&
			// ... no end or ...
			(event.end === undefined ||
				// ... ongoing or ...
				event.end === '-' ||
				// ... ends before
				event.end.decimal <= endValue)

		// if (event.start === '-') {
		// 	started = true
		// 	startsIn = true
		// }

		// if (event?.end === '-') {
		// 	ongoing = true
		// 	endsIn = true
		// } else {
		// 	if (event?.end) {
		// 		end = event.end
		// 	} else if (event.start === '-') {
		// 		end = event.start
		// 	} else {
		// 		ongoing = true
		// 		endsIn = true
		// 	}
		// }



		// Update "already started" and "ongoing" events to be at the extremes
		// Employ an offset so that the events are not incorrectly filtered
		// when the x ranges are changed.
		// if (event.start === '-') {
		// 	// console.log(event.name,'setting start date to',startValue)
		// 	event.startDate = {
		// 		year: startValue - 1,
		// 		month: 0,
		// 		day: 0,
		// 		decimal: startValue - 1
		// 	}
		// }
		// if (event?.end === '-') {
		// 	// console.log(event.name,'setting end date to',endValue)
		// 	const year = new Date().getFullYear()
		// 	event.endDate = {
		// 		year: year,
		// 		month: 0,
		// 		day: 0,
		// 		decimal: year
		// 	}
		// }

		// Range test
		// console.log('checking event',event)

		// const endDate = event?.end !== '-' ? event.end : event.start

		// let startsIn = false
		// if (started || (event.start.decimal > startValue){
		// 	startsIn = true
		// }

		// if (ongoing || event?.end.decimal)

		// 	const endDate = event.endDate ? event.endDate : event.startDate
		// const startsIn = event.startDate.year >= startValue &&
		// 	event.startDate.year <= endValue
		// const endsIn = endDate.year >= startValue &&
		// 	endDate.year <= endValue

		// if (startsIn || endsIn) {

		if (endsIn) {

			// debugger

			// console.error(event.name, 'in range')
			event.index = event.id

			if (event.start.decimal !== undefined) {
				event.left = Math.round((event.start.decimal - startValue) * scale)
			} else {
				event.left = Math.round((startValue) * scale)
			}
			event.left += Utils.CANVAS_PADDING_LEFT

			let right = 0
			if (event.end === undefined) {
				right = event.left
			} else if (event.end === '-') {
				right = Math.round(endValue * scale)
			} else {
				right = Math.round((event.end.decimal - startValue) * scale)
			}

			event.width = right - event.left + Utils.CANVAS_PADDING_RIGHT

			if (event.width < MIN_EVENT_WIDTH) {
				event.width = MIN_EVENT_WIDTH
			}

			let subCatIndex = datasetSubCats.findIndex(c => c == event.subCategory)
			if (subCatIndex == -1) {
				subCatIndex = 0
			} else {
				subCatIndex = subCatIndex % COLOUR_SET.length
			}
			event.colour = COLOUR_SET[subCatIndex]

			filtered.push(event)
		}
	})

	console.log('filtered', filtered)
	return filtered
}


function isLeap(year) {
	// three conditions to find out the leap year
	if ((0 == year % 4) && (0 != year % 100) || (0 == year % 400)) {
		// console.log(year + ' is a leap year');
		return true
	}
	//console.log(year + ' is not a leap year');
	return false
}

function getDecimalDate(date) {
	const daysInYear = isLeap(date.year) ? 366 : 365
	let total = 0
	// Add days for previous months (month is 1-based)
	for (let m = 1; m < date.month; m++) {
		total += m == 2 && isLeap(date.year) ? 29 : DAYS_IN_MONTH[m - 1]
	}
	total += date.day
	return date.year + total / daysInYear
}

const getDateParts = function (stringDate) {

	if (stringDate == undefined || stringDate == '' || stringDate == false || stringDate == '-') {
		return false
	}

	// console.log('stringDate',stringDate)
	stringDate = '' + stringDate

	const parts = stringDate.split('-')
	// console.log('parts',parts)
	let year = 0
	let month = 0
	let day = 0
	// Format 1c), 2 or 3
	if (parts.length == 1) {
		parts[0] = parts[0].toLowerCase()
		// Format 2 
		if (parts[0].endsWith('bc')) {
			year = -parseInt(parts[0].split('bc')[0])
			// Format 3
		} else if (parts[0].endsWith('mya')) {
			year = -1000000 * parts[0].split('mya')[0]
		} else if (parts[0].endsWith('my')) {
			year = 1000000 * parts[0].split('my')[0]
			// Format 1c)
		} else {
			year = parseInt(parts[0])
		}
	} else {
		// Format 1b)
		year = parseInt(parts[0])
		month = parseInt(parts[1])
		if (parts.length == 3) {
			day = parseInt(parts[2])
		}
	}

	let date = { year, month, day }
	date.decimal = getDecimalDate(date)

	return date
}

const compareDates = function (a, b) {
	if (!a || !b) {
		return 0
	}
	// Sort a before if year earlier
	if (a.year < b.year) {
		return -1
		// Sort a after if year after
	} else if (a.year > b.year) {
		return 1
		// Check month if year same
	} else if (a.month < b.month) {
		return -1
	} else if (a.month > b.month) {
		return 1
		// Check day if day same
	} else if (a.day < b.day) {
		return -1
	} else if (a.day > b.day) {
		return 1
	}
	return 0
}


const sortEventsVertically = function (events, datasetSubCats) {
	// console.error('sortEventsVertically events',events)
	// console.log('subcats',datasetSubCats)
	// A sort indices
	// x sorted
	events.sort((a, b) => a.startDate?.decimal - b.startDate?.decimal)
	events.forEach((e, i) => e.xOrder = i)
	// console.error('sorted events series by decimal',[...events])
	// Sub-category sorted
	events.sort((a, b) => {
		const aIndex = datasetSubCats.findIndex(c => c == a.subCategory)
		const bIndex = datasetSubCats.findIndex(c => c == b.subCategory)
		return aIndex - bIndex
	})
	events.forEach((e, i) => e.cOrder = i)
	// console.warn('sorted events by x-axis value and category',events)
	return [...events]
}



const processSeries = function (set, scale, startValue, endValue) {

	let filtered = []

	// console.warn('set',set)
	// console.log('scale',scale)
	// console.log('startValue',startValue)
	// console.log('endValue',endValue)

	set.forEach((series, index) => {

		filtered[index] = { ...series }
		filtered[index].data = []

		series.points.forEach((point, i) => {

			// Range test
			let inRange

			// debugger
			if (point?.date?.year) {
				inRange = point.date.year >= startValue &&
					point.date.year <= endValue
			} else {
				inRange = point.x >= startValue &&
					point.x <= endValue
			}

			if (inRange) {

				const value = point?.date?.decimal ? point.date.decimal : point.x
				const x = (value - startValue) * scale

				let xLabel = point.x
				if (point.date) {
					xLabel = formatDate(point.date)
				} else {
					xLabel = formatYear(point.x)
				}

				const newPoint = {
					index,
					i,
					value: point.value,
					xLabel,
					x: parseInt(x),
					y: 0 // To be scaled in the component
				}

				filtered[index].data.push(newPoint)
			}
		})

	})

	// console.error('filtered',filtered)

	return filtered
}


const labelAxis = function (xAxis, drawingWidth, xRange) {

	console.warn('labelAxis: range', xRange)

	// debugger

	let intervals = xRange.range

	let intervalWidth = drawingWidth / xRange.range
	if (intervalWidth < Utils.MIN_BOX_WIDTH) {
		intervals = Math.floor(drawingWidth / Utils.MIN_BOX_WIDTH)
		intervalWidth = drawingWidth / intervals
	}
	const interval = Math.round(xRange.range / intervals)
	console.log('interval', interval)

	let canvasX = Utils.CANVAS_PADDING_LEFT
	let dataX = xRange.start
	let newAxis = { ...xAxis }

	// Initialise values, ticks and labels
	newAxis.majorAxis = []
	newAxis.majorTicks = []
	newAxis.majorLabels = []

	for (let i = 0; i <= intervals; i++) {

		newAxis.majorTicks.push(parseInt(canvasX))

		// console.log('units',units)

		if (xAxis.xUnit == 'date') {
			newAxis.majorAxis.push(parseInt(dataX))
			newAxis.majorLabels.push(formatYear(parseInt(dataX)))
		} else {
			newAxis.majorAxis.push(parseInt(dataX))
			newAxis.majorLabels.push(parseInt(dataX))
		}

		canvasX += intervalWidth
		dataX += interval
	}

	newAxis.majorLast = newAxis.majorLabels[newAxis.majorLabels.length - 1]
	newAxis.majorRange = newAxis.majorLast - newAxis.majorFirst

	console.table(newAxis)

	return newAxis
}

/**
 * Smooth out user interaction
 * @param {function} fn a callback function
 * @param {number} delay delay in ms before callback triggered
 * @returns 
 */
const debounce = function (fn, delay) {
	let timeOutId
	return function (...args) {
		// Clear previous timeout if not expired
		if (timeOutId) {
			clearTimeout(timeOutId)
		}
		// Set new timeout
		timeOutId = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}


// const fetchData = async function (dataName) {
// 	const post = await fetch(`/data/${dataName}.json`)
// 	const data = await post.json()
// 	return data
// }

// const fetchDataset = async function (datasetName) {
// 	const post = await fetch(`/data/${datasetName}.json`)
// 	const dataset = await post.json()
// 	return processDataset(dataset)
// }


const getVersionHistory = function (history = []) {
	let created = ''
	let updated = false
	let versions = []
	if (history) {
		history.forEach(version => {
			const parts = version.split('§')
			if (parts.length == 2) {
				versions.push({
					date: new Date(parts[0].trim()),
					change: parts[1].trim()
				})
			}
		})
		if (versions.length > 0) {
			created = versions[0].date
		}
		if (versions.length > 1) {
			updated = versions[versions.length - 1].date
		}
	}
	return { created, updated, versions }
}


const Utils = {
	getVersionHistory,
	// fetchData,
	// fetchDataset,
	processDataset,
	initSettings,
	processEvents,
	processSeries,
	eventDates,
	labelAxis,
	debounce,
	toPrecision,
	formatNumber,
	formatYear,
	colour,
	findNormalisedMin,
	COLOUR_INACTIVE: 'var(--material-grey-400)',
	MIN_BOX_WIDTH: 80,
	CANVAS_MIN_HEIGHT: 300,
	CANVAS_PADDING_LEFT: 20,  // 20
	CANVAS_PADDING_RIGHT: 20,  // 20
	NAV_BREAK: 600,
	SITE: dev ? 'localhost' : 'https://baffledbyscience.com'
}

export default Utils