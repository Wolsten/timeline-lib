import { dev } from '$app/env';

const SYMBOLS = 7 // Must match number of symbol classes in Symbol.svelte
const MIN_EVENT_WIDTH = 4
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
		html += formatDate(event.start)
	}
	if (event.end) {
		if (event.end == '-') {
			html += ' - '
		} else {
			html += ` - ${formatDate(event.end)}`
		}
	}
	html = `(${html})`
	return html
}


const initXAxis = function (start, end) {
	const s = isDate(start) ? parseFloat(start.year) : parseFloat(start)
	const e = isDate(end) ? parseFloat(end.year) : parseFloat(end)
	const axis = {
		values: [],
		ticks: [],
		labels: [],
		majorFirst: s,
		majorLast: e,
		majorRange: e - s,
	}
	console.log('initAxis: axis', axis)
	return axis
}


const initSettings = function (xUnit, userSettings, start, end, subCats) {

	// Apply default settings where required
	// Note that only non-defaults should be set in user settings
	let settings = {
		symbols: userSettings.symbols || false,
		readonly: userSettings.readonly || false,
		totalise: userSettings.totalise || false,
		categorise: userSettings.categorise || false,
		logscale: userSettings.logscale || false,
		search: userSettings.search || '',
		filter: userSettings.filter || '',
		title: userSettings.title || '',
		sort: userSettings.sort || 'x',
		subCats: userSettings?.subCats?.length > 0 ? userSettings.subCats : subCats,

	}
	// If have no user settings for xRange then use the data otherwise apply user settings,
	// checking for whether dealing with dates or simple numbers
	// let s, e
	// if (userSettings.xRange === undefined) {
	// 	s = start.year ? start.year : start.decimal
	// 	e = end.year ? end.year : end.decimal
	// } else {
	// 	s = userSettings.start
	// 	e = userSettings.end
	// }
	// console.log('start', start)

	// debugger

	let s, e
	if (xUnit === 'date') {
		if (userSettings.start !== undefined) {
			s = getDateParts(userSettings.start).year
		} else {
			s = start.year
		}
		if (userSettings.end !== undefined) {
			e = getDateParts(userSettings.end).year
		} else {
			e = end.year
		}
	} else {
		s = userSettings.start !== undefined ? parseFloat(userSettings.start) : parseFloat(start)
		e = userSettings.end !== undefined ? parseFloat(userSettings.end) : parseFloat(end)
	}

	console.log('s,e', s, e)

	settings.xRange = {
		start: s,
		end: e,
		range: e - s
	}

	console.log('initSettings', settings)

	return settings
}

const initCategories = function (xUnit, events, set) {

	// console.log('creating new group from series', series)
	let groups = []

	// Get two lists of unique sub categories
	let seriesSubCats = new Set
	set.forEach(series => {
		seriesSubCats.add(series.subCategory)
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

	// debugger

	// Generate totalised sub category groups
	if (set.length > 0) {

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

			set.forEach(series => {

				group.xUnit = series.xUnit
				group.citations = series.citations

				if (cat == 'total' || series.subCategory == cat) {

					series.points.forEach(point => {

						// Look for point with same x
						let match = group.points.findIndex(pt => {
							if (xUnit === 'date') {
								return pt.x.year == point.x.year
							} else {
								return pt.x == point.x
							}
						})

						// Create new point or add existing to match
						if (group.points.length == 0 || match == -1) {
							// match = 0
							// *** IMPORTANT *** MUST PUSH A COPY NOT THE ORIGINAL
							group.points.push({ ...point })
							match = group.points.length - 1
						} else {
							group.points[match].y += point.y
						}

						if (group.points[match].y > group.max) {
							group.max = group.points[match].y
						}
						if (group.points[match].y < group.min) {
							group.min = group.points[match].y
						}

					})
				}
			})

			if (xUnit === 'date') {
				group.points.sort((a, b) => a.x.year - b.x.year)
			} else {
				group.points.sort((a, b) => a.x - b.x)
			}

			groups.push(group)
		})

	}

	console.error('groups', groups, 'seriesSubCats', seriesSubCats)

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
	// Convert end string dates to date objects and find extremes
	data.events.forEach((event, index) => {
		// if (index === 1) {
		// 	debugger
		// }
		// Get date parts if available - otherwise get back the existing value
		event.start = getDateParts(event.start)
		event.end = getDateParts(event.end)
		// Check start date - compareDates handles '-' ongoing events
		if (isDate(event.start) &&
			(data.start === undefined || compareDates(event.start, data.start) == DATE_BEFORE)) {
			// console.log('setting startdate', event.name, event.start.year)
			data.start = event.start
		}
		// Check (optional end date)
		if (isDate(event.end) &&
			(data.end === undefined || compareDates(data.end, event.end) === DATE_BEFORE)) {
			// console.log('setting enddate', event.name, event.end.year)
			data.end = event.end
		}
	})

	// Do the same for each series
	// Would only have these if the xUnits are both 'dates' or have no events
	data.series.forEach((item) => {
		item.points.forEach(point => {
			// Start and end x range
			// Handle as dates
			if (data.xUnit === 'date') {
				point.x = getDateParts(point.x)
				// console.log('point x', point.x)
				if (data.start === undefined || compareDates(point.x, data.start) == DATE_BEFORE) {
					data.start = point.x
				}
				if (data.end === undefined || compareDates(data.end, point.x) == DATE_BEFORE) {
					data.end = point.x
				}
				// Handle numbers
			} else {
				if (data.start === undefined || data.start.decimal < point.x) {
					data.start = point.x
				}
				if (data.end === undefined || point.x < data.end.decimal) {
					data.end = point.x
				}
			}
			// Max and min y values
			if (data.min === undefined || point.y < data.min) {
				data.min = point.y
			}
			if (data.max === undefined || point.y > data.max) {
				data.max = point.y
			}
		})
	})

	// Shouldn't happen but just in case
	if (data.end === undefined) {
		data.end = data.start
	}

	// Initialise x axis
	data.xAxis = initXAxis(data.start, data.end)

	// Initialise categories and colours
	const groupsAndSubCats = initCategories(data.xUnit, data.events, data.series)
	data.eventsSubCats = groupsAndSubCats.eventsSubCats
	data.seriesSubCats = groupsAndSubCats.seriesSubCats
	const seriesAndGroups = initSeriesColours(data.series, groupsAndSubCats.groups)
	data.series = seriesAndGroups.series
	data.groups = seriesAndGroups.groups
	console.log('dataset', data)
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

/**
 * Filter the events by start/end times and category
 * @param {Array} events 
 * @param {Number} scale 
 * @param {Number} xStart 
 * @param {Number} xEnd 
 * @param {Array} datasetSubCats 
 * @returns {Array}
 */
const filterEventsByXRange = function (events, scale, xStart, xEnd, datasetSubCats) {
	let filtered = []
	// Scale each event
	events.forEach((event, index) => {
		// if (event.id == 1) {
		// 	console.error('event', event)
		// 	// debugger
		// }
		// Check if starts in the the range defined by 
		const occursIn =
			// Already started or ...
			event.start === '-' ||
			// ... started after reference startValue &&
			event.start.decimal >= xStart &&
			// ... started before reference end value
			event.start.decimal <= xEnd &&
			// ... no end or ongoing or ends before reference endValue
			(event.end === undefined || event.end === '-' || event.end.decimal <= xEnd)

		if (occursIn) {

			event.index = event.id

			if (event.start.decimal !== undefined) {
				event.left = Math.round((event.start.decimal - xStart) * scale)
			} else {
				event.left = Math.round((xStart) * scale)
			}

			let right = 0
			if (event.end === undefined) {
				right = event.left
			} else if (event.end === '-') {
				right = Math.round((xEnd - xStart) * scale)
			} else {
				right = Math.round((event.end.decimal - xStart) * scale)
			}

			event.width = right - event.left

			event.left += Utils.CANVAS_PADDING_LEFT

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

	if (stringDate === undefined ||
		stringDate === '-') {
		return stringDate
	}

	//console.log('stringDate', stringDate)
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


const isDate = function (d) {
	return d !== undefined &&
		d.day !== undefined &&
		d.month !== undefined &&
		d.year !== undefined
}

const getYearOrValue = function (dv) {
	if (isDate(dv)) {
		return dv.year
	}
	if (typeof dv === 'number') {
		return dv
	}
	return false
}


const compareDates = function (a, b) {

	if (!isDate(a) && !isDate(b) &&
		typeof a !== 'number') {
		return 0
	}
	// if (!a || !b) {
	// 	return 0
	// }
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



const processSeries = function (set, scale, xStart, xEnd) {

	let filtered = []

	// console.warn('set',set)
	// console.log('scale',scale)
	// console.log('xStart',xStart)
	// console.log('xEnd',xEnd)

	set.forEach((series, index) => {

		filtered[index] = { ...series, data: [] }

		series.points.forEach((point, i) => {

			// debugger

			// Range test
			let inRange

			if (isDate(point.x)) {
				inRange = point.x.decimal >= xStart && point.x.decimal <= xEnd
			} else {
				inRange = point.x >= xStart && point.x <= xEnd
			}

			if (inRange) {

				const valueX = isDate(point.x) ? point.x.decimal : point.x
				const canvasX = Utils.CANVAS_PADDING_LEFT + (valueX - xStart) * scale

				let xLabel = ''
				if (isDate(point.x)) {
					xLabel = formatDate(point.x)
				} else {
					xLabel = formatYear(point.x)
				}

				const newPoint = {
					index,
					i,
					xLabel,
					x: parseInt(canvasX),
					// @todo Will need to fix in component - think done in Canvas but need to check
					value: point.y,
					y: 0 // To be scaled in the component
				}

				filtered[index].data.push(newPoint)
			}
		})

	})

	console.error('filtered', filtered)

	return filtered
}

/**
 * Scale and label the axis based on the current data range defined in xAxis
 * and constrained by the options range
 * @param {string} xUnit 'date', 'number'
 * @param {Object} xAxis 
 * @param {Number} drawingWidth 
 * @param {Object} optionsXRange 
 * @returns {Object}
 */
const scaleXAxis = function (xUnit, xAxis, drawingWidth, optionsXRange) {

	console.warn('scaleXAxis: options x range', optionsXRange)
	console.log('scaleXAxis: old xAxis')
	console.table(xAxis)

	// debugger
	const intervals = Math.floor(drawingWidth / Utils.MIN_BOX_WIDTH)
	const canvasInterval = Math.round(drawingWidth / intervals)
	const dataInterval = Math.round(optionsXRange.range / intervals)

	console.log('scaleXAxis: intervals, canvasInterval, dataInterval', intervals, canvasInterval, dataInterval)

	let canvasX = Utils.CANVAS_PADDING_LEFT
	let dataX = optionsXRange.start
	let newAxis = { ...xAxis }

	// Initialise values, ticks and labels
	newAxis.values = []
	newAxis.ticks = []
	newAxis.labels = []

	for (let i = 0; i <= intervals; i++) {

		newAxis.ticks.push(parseInt(canvasX))

		// console.log('units',units)

		if (xUnit === 'date') {
			newAxis.values.push(parseInt(dataX))
			newAxis.labels.push(formatYear(parseInt(dataX)))
		} else {
			newAxis.values.push(parseInt(dataX))
			newAxis.labels.push(parseInt(dataX))
		}

		canvasX += canvasInterval
		dataX += dataInterval
	}

	newAxis.majorLast = newAxis.labels[newAxis.labels.length - 1]
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
	scaleXAxis,
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