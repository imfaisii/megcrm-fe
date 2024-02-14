import moment from 'moment'
import * as mt from 'moment-timezone'

export default function useTime() {
  const DEFAULT_FORMAT = 'MMMM Do YYYY, h:mm:ss a'

  const currentTime = (format = DEFAULT_FORMAT) => moment().format(format)

  // Function to format a date using Moment.js
  const formatDate = (date: any, format = DEFAULT_FORMAT) => {
    return moment(date).format(format)
  }

  const diffForHumans = (date: any, format = DEFAULT_FORMAT) => {
    return moment(date).fromNow()
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
    diffForHumans,
    getClientTimeZone,
    currentTime
  }
}
