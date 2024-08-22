export const formatTimeDuration = (timeString) => {
  if (timeString !== '' && timeString !== null) {
    const [hours, minutes] = timeString.split(':').map(Number)
    let formattedHours = ''
    let formattedMins = ''
    let hrSuffix = ''
    let minSuffix = ''

    if (hours > 0) {
      formattedHours = hours.toString().padStart(2, '0')
      hrSuffix = hours === 1 ? 'hr' : 'hrs'
    } else {
      formattedHours = '00'
    }

    if (minutes > 0) {
      formattedMins = minutes.toString().padStart(2, '0')
      minSuffix = 'min' + (minutes === 1 ? '' : 's')
    } else {
      formattedMins = '00'
    }

    const totalTime = `${formattedHours}:${formattedMins} ${
      formattedMins === '00' ? hrSuffix : minSuffix
    }`.trim()
    return totalTime === '00:00' ? '-' : totalTime
  } else {
    return '-'
  }
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  let formattedDate = date.toLocaleDateString('en-GB', options)
  if (!formattedDate.includes(',')) {
    formattedDate = formattedDate.replace(/(\w{3}) (\d{4})/, '$1, $2')
  }
  return formattedDate
}

export const formatAmountWithCommas = (amount, currency) => {
  if (amount !== '' && currency !== 'null') {
    let formatEn = ''
    if (currency === 'USD') {
      formatEn = 'en-US'
    } else {
      formatEn = 'en-IN'
    }
    const formattedAmount = new Intl.NumberFormat(formatEn, {
      style: 'currency',
      currency: currency,
    })
    return formattedAmount.format(amount)
  } else {
    return '---'
  }
}

export function toPascalCase(str) {
  return (
    str &&
    str.replace(/\w\S*/g, function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
  )
}

export function getToday() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const textWrap = (value, maxLength) => {
  const modifiedTitle = value
  return modifiedTitle.length > maxLength
    ? `${modifiedTitle.substring(0, maxLength)}...`
    : modifiedTitle
}
