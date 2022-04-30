/*
 * Date Format 日期格式化
 */

// Regexes and supporting functions are cached through closure
const token = /d{1,4}|D{3,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|W{1,2}|[LlopSZN]|"[^"]*"|'[^']*'/g
const timezone =
  /\b(?:[A-Z]{1,3}[A-Z][TC])(?:[-+]\d{4})?|((?:Australian )?(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time)\b/g
const timezoneClip = /[^-+\dA-Z]/g

/**
 * @param {string | number | Date} date
 * @param {string} mask
 * @param {boolean} utc
 * @param {boolean} gmt
 */
export function dateFormat(date, mask, utc, gmt) {
  // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
  if (arguments.length === 1 && typeof date === 'string' && !/\d/.test(date)) {
    mask = date
    date = undefined
  }

  date = date || date === 0 ? date : new Date()

  if (!(date instanceof Date)) {
    date = new Date(date)
  }

  if (isNaN(date)) {
    throw TypeError('Invalid date')
  }

  mask = String(masks[mask] || mask || masks['default'])

  // Allow setting the utc/gmt argument via the mask
  const maskSlice = mask.slice(0, 4)
  if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
    mask = mask.slice(4)
    utc = true
    if (maskSlice === 'GMT:') {
      gmt = true
    }
  }

  const _ = () => (utc ? 'getUTC' : 'get')
  const d = () => date[_() + 'Date']()
  const D = () => date[_() + 'Day']()
  const m = () => date[_() + 'Month']()
  const y = () => date[_() + 'FullYear']()
  const H = () => date[_() + 'Hours']()
  const M = () => date[_() + 'Minutes']()
  const s = () => date[_() + 'Seconds']()
  const L = () => date[_() + 'Milliseconds']()
  const o = () => (utc ? 0 : date.getTimezoneOffset())
  const W = () => getWeek(date)
  const N = () => getDayOfWeek(date)

  const flags = {
    d: () => d(),
    dd: () => pad(d()),
    ddd: () => i18n.dayNames[D()],
    DDD: () =>
      getDayName({
        y: y(),
        m: m(),
        d: d(),
        _: _(),
        dayName: i18n.dayNames[D()],
        short: true
      }),
    dddd: () => i18n.dayNames[D() + 7],
    DDDD: () =>
      getDayName({
        y: y(),
        m: m(),
        d: d(),
        _: _(),
        dayName: i18n.dayNames[D() + 7]
      }),
    m: () => m() + 1,
    mm: () => pad(m() + 1),
    mmm: () => i18n.monthNames[m()],
    mmmm: () => i18n.monthNames[m() + 12],
    yy: () => String(y()).slice(2),
    yyyy: () => pad(y(), 4),
    h: () => H() % 12 || 12,
    hh: () => pad(H() % 12 || 12),
    H: () => H(),
    HH: () => pad(H()),
    M: () => M(),
    MM: () => pad(M()),
    s: () => s(),
    ss: () => pad(s()),
    l: () => pad(L(), 3),
    L: () => pad(Math.floor(L() / 10)),
    t: () => (H() < 12 ? i18n.timeNames[0] : i18n.timeNames[1]),
    tt: () => (H() < 12 ? i18n.timeNames[2] : i18n.timeNames[3]),
    T: () => (H() < 12 ? i18n.timeNames[4] : i18n.timeNames[5]),
    TT: () => (H() < 12 ? i18n.timeNames[6] : i18n.timeNames[7]),
    Z: () => (gmt ? 'GMT' : utc ? 'UTC' : formatTimezone(date)),
    o: () => (o() > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o()) / 60) * 100 + (Math.abs(o()) % 60), 4),
    p: () =>
      (o() > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o()) / 60), 2) + ':' + pad(Math.floor(Math.abs(o()) % 60), 2),
    S: () => ['th', 'st', 'nd', 'rd'][d() % 10 > 3 ? 0 : (((d() % 100) - (d() % 10) != 10) * d()) % 10],
    W: () => W(),
    WW: () => pad(W()),
    N: () => N()
  }

  return mask.replace(token, match => {
    if (match in flags) {
      return flags[match]()
    }
    return match.slice(1, match.length - 1)
  })
}

let masks = {
  default: 'ddd mmm dd yyyy HH:MM:ss',
  shortDate: 'm/d/yy',
  paddedShortDate: 'mm/dd/yyyy',
  mediumDate: 'mmm d, yyyy',
  longDate: 'mmmm d, yyyy',
  fullDate: 'dddd, mmmm d, yyyy',
  shortTime: 'h:MM TT',
  mediumTime: 'h:MM:ss TT',
  longTime: 'h:MM:ss TT Z',
  isoDate: 'yyyy-mm-dd',
  isoTime: 'HH:MM:ss',
  isoDateTime: "yyyy-mm-dd'T'HH:MM:sso",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
  expiresHeaderFormat: 'ddd, dd mmm yyyy HH:MM:ss Z'
}

// Internationalization strings
let i18n = {
  dayNames: [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],
  monthNames: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  timeNames: ['a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM']
}

const pad = (val, len = 2) => String(val).padStart(len, '0')

/**
 * Get day name
 * Yesterday, Today, Tomorrow if the date lies within, else fallback to Monday - Sunday
 * @param  {Object}
 * @return {String}
 */
const getDayName = ({ y, m, d, _, dayName, short = false }) => {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday[_ + 'Date']() - 1)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow[_ + 'Date']() + 1)
  const today_d = () => today[_ + 'Date']()
  const today_m = () => today[_ + 'Month']()
  const today_y = () => today[_ + 'FullYear']()
  const yesterday_d = () => yesterday[_ + 'Date']()
  const yesterday_m = () => yesterday[_ + 'Month']()
  const yesterday_y = () => yesterday[_ + 'FullYear']()
  const tomorrow_d = () => tomorrow[_ + 'Date']()
  const tomorrow_m = () => tomorrow[_ + 'Month']()
  const tomorrow_y = () => tomorrow[_ + 'FullYear']()

  if (today_y() === y && today_m() === m && today_d() === d) {
    return short ? 'Tdy' : 'Today'
  } else if (yesterday_y() === y && yesterday_m() === m && yesterday_d() === d) {
    return short ? 'Ysd' : 'Yesterday'
  } else if (tomorrow_y() === y && tomorrow_m() === m && tomorrow_d() === d) {
    return short ? 'Tmw' : 'Tomorrow'
  }
  return dayName
}

/**
 * Get the ISO 8601 week number
 * Based on comments from
 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
 *
 * @param  {Date} `date`
 * @return {Number}
 */
const getWeek = date => {
  // Remove time components of date
  const targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  // Change date to Thursday same week
  targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3)

  // Take January 4th as it is always in week 1 (see ISO 8601)
  const firstThursday = new Date(targetThursday.getFullYear(), 0, 4)

  // Change date to Thursday same week
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3)

  // Check if daylight-saving-time-switch occurred and correct for it
  const ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset()
  targetThursday.setHours(targetThursday.getHours() - ds)

  // Number of weeks between target Thursday and first Thursday
  const weekDiff = (targetThursday - firstThursday) / (86400000 * 7)
  return 1 + Math.floor(weekDiff)
}

/**
 * Get ISO-8601 numeric representation of the day of the week
 * 1 (for Monday) through 7 (for Sunday)
 *
 * @param  {Date} `date`
 * @return {Number}
 */
const getDayOfWeek = date => {
  let dow = date.getDay()
  if (dow === 0) {
    dow = 7
  }
  return dow
}

/**
 * Get proper timezone abbreviation or timezone offset.
 *
 * This will fall back to `GMT+xxxx` if it does not recognize the
 * timezone within the `timezone` RegEx above. Currently only common
 * American and Australian timezone abbreviations are supported.
 *
 * @param  {String | Date} date
 * @return {String}
 */
export const formatTimezone = date => {
  return (String(date).match(timezone) || [''])
    .pop()
    .replace(timezoneClip, '')
    .replace(/GMT\+0000/g, 'UTC')
}

/**
 * 获取上一个月
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
export const getPreMonth = date => {
  var arr = date.split('-')
  var year = arr[0] //获取当前日期的年份
  var month = arr[1] //获取当前日期的月份
  var day = arr[2] //获取当前日期的日
  // var days = new Date(year, month, 0)
  // days = days.getDate() //获取当前日期中月的天数
  var year2 = year
  var month2 = parseInt(month) - 1
  if (month2 == 0) {
    year2 = parseInt(year2) - 1
    month2 = 12
  }
  var day2 = day
  var days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }
  var t2 = year2 + '-' + month2 + '-' + day2
  return t2
}

// 将分钟数量转换为小时和分钟字符串
export const toHourMinute = minutes => {
  return `${Math.floor(minutes / 60)}h${minutes % 60}m`
}
