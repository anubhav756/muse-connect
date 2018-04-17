import Moment from 'moment'
import _ from 'lodash'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment);

// converts a number to 2 decimal format, and 0.00 by default
export function twoDecimalFormat(number = 0) {
  return number ? parseFloat(Math.round(number * 100) / 100).toFixed(2) : '0.00';
}

// return week number of a date
export function getWeekNum(date = new Date()) {
  date.setHours(0, 0, 0, 0);
  date.setDate((date.getDate() + 3) - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((((date.getTime() - week1.getTime()) / 86400000)
    - 3) + ((week1.getDay() + 6) % 7)) / 7);
}

// return start time of a date
export function getStartTime(_date) {
  const date = new Date(_date);

  date.setHours(0, 0, 0, 0);
  return date;
}

// return end time of a date
export function getEndTime(_date) {
  const date = new Date(_date);

  date.setHours(23, 59, 59, 999);
  return date;
}

// capitalizes first letter of string, and lowercases other
export function capitalize(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// validates date
export function isDate(date) {
  if (!date) {
    return false
  }

  return moment(date).isValid()
}
// returns diff between two dates
// return false in case of invalid dates
export function getDifferenceBetweenDates(startTime, endTime, durationType = 'days') {
  if (isDate(endTime) && isDate(startTime)) {
    return moment(startTime).diff(moment(endTime), durationType, true)
  }
  return false
}

export function secondsToMinutes(totalSeconds = 0, showLabel) {
  let timeLabel = null;

  if (!totalSeconds)
    timeLabel = '0:00';
  else
    timeLabel = `${Math.floor(totalSeconds / 60)}:${(`0${totalSeconds % 60}`).slice(-2)}`;

  if (!showLabel)
    return timeLabel;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (!minutes)
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  if (!seconds)
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  return `${timeLabel} minutes`;
}

export function areInSameMonth(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

export function areInSameDay(date1, date2) {
  const normalizeDate1 = new Date(date1).setHours(0, 0, 0, 0)
  const normalizeDate2 = new Date(date2).setHours(0, 0, 0, 0)
  return normalizeDate1 === normalizeDate2
}

export function normaliseSeconds(duration) {
  const hour = Math.floor(duration / 3600);
  const min = Math.floor((duration % 3600) / 60);
  const sec = Math.floor(duration % 3600 % 60);
  return { hour, min, sec }
}

export function getCurrentDay() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

export function isInCurrentMonth(date) {
  const dateMonth = date.getMonth()
  const dateYear = date.getYear()
  const currentDate = getCurrentDay()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getYear()
  return (dateMonth === currentMonth && dateYear === currentYear)
}

export function getFirstDay(date) {
  const month = date.getMonth()
  const year = date.getFullYear()
  return new Date(year, month, 1)
}

export function getLastDay(date) {
  const month = date.getMonth()
  const year = date.getFullYear()
  return new Date(year, month + 1, 0)
}

export function getFirstLastDay(date) {
  const firstDateMonth = getFirstDay(date)
  const lastDateMonth = getLastDay(date)
  let endDate = lastDateMonth
  const startDate = firstDateMonth
  if (isInCurrentMonth(endDate)) {
    endDate = getCurrentDay()
  }
  return { startDate, endDate }
}

export function getRange(startDate, endDate) {
  return moment.range(startDate, endDate)
}

export function getPrevMonthDay(date) {
  return new Date(date.setMonth(date.getMonth() - 1))
}

export function getPrevDay(date) {
  const copyDate = new Date(date)
  return copyDate.setDate(copyDate.getDate() - 1)
}

export function getNextDay(date) {
  const copyDate = new Date(date)
  return copyDate.setDate(copyDate.getDate() + 1)
}

/*
 * @function isEmpty checks if any key of object has value return not empty
 * @param {Object} object
 * @returns {Boolean} true/false
 */
export function isEmpty(object) {
  let state = true
  _.forEach(object || {}, (value) => {
    if (value) {
      state = false
    }
  })
  return state
}

export function commafy(values = []) {
  return _.reduce(
    _.map(values, (v, i) => (i + 1 >= values.length ? v : i + 2 === values.length ? ` ${v} and ` : ` ${v},`)),
    (result, value) => `${result}${value}`,
    ''
  )
}

export default { getDifferenceBetweenDates, isDate, isInCurrentMonth }
