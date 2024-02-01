import moment from 'moment'
import * as mt from 'moment-timezone'

export default function useTime() {
  const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss'

  // Function to format a date using Moment.js
  const formatDate = (date: any, format = DEFAULT_FORMAT) => {
    return moment(date).format(format)
  }

  // Function to get the current date and time
  const getCurrentDateTime = () => {
    return moment().format(DEFAULT_FORMAT)
  }

  // Function to calculate the difference between two dates
  const calculateDateDiff = (startDate: any, endDate: any, unit = 'days') => {
    return moment(endDate).diff(moment(startDate), unit)
  }

  const getClientTimeZone = () => mt.tz.guess()

  return {
    DEFAULT_FORMAT,
    formatDate,
    getCurrentDateTime,
    calculateDateDiff,
    getClientTimeZone
  }
}
