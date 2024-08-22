import UseAxios from '../../constant/UseAxios'
import { getHeaders } from 'src/constant/Global'
import dayjs from 'dayjs'
import {
  APPROVED_PRODUCT_LIST,
  EXISTING_DATES,
  TASK_LIST,
  YESTERDAY_COUNT,
  GET_SUBMITTED_TIMESHEET,
  GET_RAISED_REQUEST,
  GET_LEAVE_HISTORY,
  WITHDRAW_LEAVE_SUCCESS,
  WITHDRAW_LEAVE_FAILURE,
  SET_PENDING_DATA,
} from '../actionType'
const api = UseAxios()

export const getproductList = () => {
  return (dispatch) => {
    const url = `product/approvedlist`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: APPROVED_PRODUCT_LIST,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getTaskActivityList = () => {
  return (dispatch) => {
    const url = 'master/taskcategory/get/taskcategory'
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        const data = res.data.data
        if (data.length !== 0) {
          const task = data.categories
          dispatch({
            type: TASK_LIST,
            payload: task,
          })
        } else {
          dispatch({
            type: TASK_LIST,
            payload: [],
          })
        }
      })
      .catch((error) => {})
  }
}

export const getExistsDates = (currentMonthYear) => {
  return (dispatch) => {
    const year = dayjs(currentMonthYear).format('YYYY')
    const month = dayjs(currentMonthYear).format('MM')
    const url = `activity/timeSheet/status?month=${month}&year=${year}`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        const data = res.data.data
        if (data) {
          dispatch({
            type: EXISTING_DATES,
            payload: data,
          })
        }
      })
      .catch((error) => {})
  }
}

export const getYesterdayCount = (date) => {
  return (dispatch) => {
    const parsedDate = dayjs(date, 'DD MMM, YYYY')
    const formattedDate = parsedDate.format('YYYY-MM-DD')
    const url = 'approval/product/approvaldate/' + formattedDate
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        const data = res.data
        if (data) {
          dispatch({
            type: YESTERDAY_COUNT,
            payload: data,
          })
        }
      })
      .catch((error) => {})
  }
}

export const submitActivity = (data) => {
  return () => {
    const url = `common/timesheet/activity`
    const response = api.post(url, data, {
      headers: getHeaders('multi'),
    })
    return response
  }
}

export const withDrawLeave = (id) => {
  return async (dispatch) => {
    try {
      const url = `activity/attendance/delete?id=${id}`
      const response = await api.put(url, {
        headers: getHeaders('json'),
      })

      if (response && response.data) {
        dispatch({
          type: WITHDRAW_LEAVE_SUCCESS,
          payload: response.data,
        })
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      dispatch({
        type: WITHDRAW_LEAVE_FAILURE,
        error: error.message,
      })
      throw error
    }
  }
}

export const getSubmittedActivity = (page, pageSize, filter, date) => {
  return (dispatch) => {
    // Ensure page is a number
    let pageNo = typeof page === 'number' ? page : 0

    // Ensure pageSize is a number
    let size = typeof pageSize === 'number' ? pageSize : 10 // Default to 10 if not a number

    // Construct the URL with proper encoding
    let url = `/common/timesheet/activity/submit-list?page=${encodeURIComponent(
      pageNo,
    )}&size=${encodeURIComponent(size)}`

    if (date && typeof date === 'string' && date.trim() !== '') {
      url += `&date=${encodeURIComponent(date)}&filter=${encodeURIComponent(filter)}`
    } else {
      url += `&filter=${encodeURIComponent(filter)}`
    }
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: GET_SUBMITTED_TIMESHEET,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const createAttendanceSheet = (date, status) => {
  return () => {
    const format = dayjs(date).format('YYYY-MM-DD')
    const url = `activity/attendanceSheet/${format}/status/${status}`
    const response = api.post(
      url,
      {},
      {
        headers: getHeaders('json'),
      },
    )
    return response
  }
}

export const EditSubmittedActivity = (id) => {
  return () => {
    const url = `common/timesheet/activity/edit/` + id
    const response = api.get(url, {
      headers: getHeaders('json'),
    })
    return response
  }
}

export const EditRaisedRequest = (id) => {
  return () => {
    const url = `activity/raisedRequest/getData/` + id
    const response = api.get(url, {
      headers: getHeaders('json'),
    })
    return response
  }
}

export const getRaisedRequest = (page, pageSize, filter, date, status) => {
  return (dispatch) => {
    // Ensure page is a number
    let pageNo = typeof page === 'number' ? page : 0

    // Ensure pageSize is a number
    let size = typeof pageSize === 'number' ? pageSize : 10 // Default to 10 if not a number

    // Construct the URL with proper encoding
    let url = `/activity/raisedRequest/byuser?page=${pageNo}&size=${size}&filter=${encodeURIComponent(
      filter,
    )}`

    if (date && date.trim() !== '' && date != null) {
      url += `&date=${encodeURIComponent(date)}`
    }
    if (status !== '' && status != null) {
      url += `&status=${encodeURIComponent(status)}`
    }

    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: GET_RAISED_REQUEST,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getLeaveHistory = (page, pageSize, date) => {
  return (dispatch) => {
    // Ensure page is a number
    let pageNo = typeof page === 'number' ? page : 0

    // Ensure pageSize is a number
    let size = typeof pageSize === 'number' ? pageSize : 10 // Default to 10 if not a number

    // Construct the URL with proper encoding
    let url = `/activity/attendanceSheet/byuser?page=${pageNo}&size=${size}`

    if (date && typeof date === 'string' && date.trim() !== '') {
      url += `&date=${encodeURIComponent(date)}`
    }
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: GET_LEAVE_HISTORY,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const setPendingData = (data) => {
  return {
    type: SET_PENDING_DATA,
    payload: data,
  }
}
