import {
  GET_MEMBER_ACTIVITY,
  STATUS_CHANGE_SUCCESS,
  STATUS_CHANGE_FAILURE,
  GET_CONTRACT_MEMBER_ACTIVITY,
  GET_CONTRACT_CLOSED_MEMBER_ACTIVITY,
  GET_OWNER_MEMBER_ACTIVITY,
  GET_PRODUCT_MEMBER_CLOSED_ACTIVITY,
} from '../actionType'
import UseAxios from '../../constant/UseAxios'
import { getHeaders } from 'src/constant/Global'
const api = UseAxios()

export const getMemberActivity = (page, pageSize, category, status, startDate, endDate) => {
  return async (dispatch) => {
    // Ensure page is a number
    let pageNo = typeof page === 'number' ? page : 0

    // Ensure pageSize is a number
    let size = typeof pageSize === 'number' ? pageSize : 10 // Default to 10 if not a number

    // Construct the URL with proper encoding
    let url = `/common/timesheet/activity/superviserlistall?page=${encodeURIComponent(
      pageNo,
    )}&size=${encodeURIComponent(size)}&category=${encodeURIComponent(category)}`
    if (status && status !== 'undefined' && status !== '') {
      url += `&status=${encodeURIComponent(status)}`
    }
    if (startDate && typeof startDate === 'string' && startDate.trim() !== '') {
      url += `&startDate=${encodeURIComponent(startDate)}`
    }
    if (endDate && typeof endDate === 'string' && endDate.trim() !== '') {
      url += `&endDate=${encodeURIComponent(endDate)}`
    }
    const response = await api.get(url, {
      headers: getHeaders('json'),
    })
    if (response?.data) {
      dispatch({
        type: GET_MEMBER_ACTIVITY,
        payload: response.data.data,
      })
      return response.data
    }
    // .then((res) => {
    //   dispatch({
    //     type: GET_MEMBER_ACTIVITY,
    //     payload: res.data.data,
    //   })
    // })
    // .catch((error) => {})
  }
}

export const getContractMemberActivity = (page, pageSize, category, status, startDate, endDate) => {
  return (dispatch) => {
    // Ensure page is a number
    let pageNo = typeof page === 'number' ? page : 0

    // Ensure pageSize is a number
    let size = typeof pageSize === 'number' ? pageSize : 10 // Default to 10 if not a number

    // Construct the URL with proper encoding
    let url = `/common/timesheet/activity/final-approve-list?page=${encodeURIComponent(
      pageNo,
    )}&size=${encodeURIComponent(size)}&category=${encodeURIComponent(category)}`
    if (status && status !== 'undefined' && status !== '') {
      url += `&status=${encodeURIComponent(status)}`
    }
    if (startDate && typeof startDate === 'string' && startDate.trim() !== '') {
      url += `&startDate=${encodeURIComponent(startDate)}`
    }
    if (endDate && typeof endDate === 'string' && endDate.trim() !== '') {
      url += `&endDate=${encodeURIComponent(endDate)}`
    }
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: GET_CONTRACT_MEMBER_ACTIVITY,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const memberStatusChange = (statusValue, id, remarks) => {
  return async (dispatch) => {
    const url = `common/timesheet/approval/update`
    const formData = new FormData()
    formData.append('status', statusValue)
    formData.append('remarks', remarks)
    formData.append('id', id)

    try {
      const response = await api.put(url, formData, {
        headers: getHeaders('multi'),
      })
      if (response?.data) {
        dispatch({
          type: STATUS_CHANGE_SUCCESS,
          payload: response.data,
        })
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      dispatch({
        type: STATUS_CHANGE_FAILURE,
        error: error.message,
      })
      throw error
    }
  }
}

export const contractMemberStatusChange = (statusValue, id, remarks) => {
  return async (dispatch) => {
    const url = `common/timesheet/approval/common/final-approved`
    const formData = new FormData()
    formData.append('status', statusValue)
    formData.append('remarks', remarks)
    formData.append('id', id)

    try {
      const response = await api.put(url, formData, {
        headers: getHeaders('multi'),
      })
      if (response?.data) {
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      throw error
    }
  }
}

export const getClosedContractMemberActivity = (page, pageSize, category, status) => {
  return (dispatch) => {
    // Ensure page is a number
    let pageNo = typeof page === 'number' ? page : 0

    // Ensure pageSize is a number
    let size = typeof pageSize === 'number' ? pageSize : 10 // Default to 10 if not a number

    // Construct the URL with proper encoding
    let url = `/common/timesheet/activity/final-approve-list/approved?page=${encodeURIComponent(
      pageNo,
    )}&size=${encodeURIComponent(size)}&category=${encodeURIComponent(category)}`
    if (status && status !== 'undefined' && status !== '') {
      url += `&status=${encodeURIComponent(status)}`
    }
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: GET_CONTRACT_CLOSED_MEMBER_ACTIVITY,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getOwnerMemberActivity = (page, pageSize, category, startDate, endDate) => {
  return (dispatch) => {
    // Ensure page is a number
    let pageNo = typeof page === 'number' ? page : 0

    // Ensure pageSize is a number
    let size = typeof pageSize === 'number' ? pageSize : 10 // Default to 10 if not a number

    // Construct the URL with proper encoding
    let url = `/common/timesheet/activity/owner/list?page=${encodeURIComponent(
      pageNo,
    )}&size=${encodeURIComponent(size)}&category=${encodeURIComponent(category)}`

    if (startDate && typeof startDate === 'string' && startDate.trim() !== '') {
      url += `&startDate=${encodeURIComponent(startDate)}`
    }
    if (endDate && typeof endDate === 'string' && endDate.trim() !== '') {
      url += `&endDate=${encodeURIComponent(endDate)}`
    }
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: GET_OWNER_MEMBER_ACTIVITY,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const ownerMemberStatusUpdate = (statusValue, id, remarks) => {
  return async (dispatch) => {
    const url = `common/timesheet/approval/owner/update`
    const formData = new FormData()
    formData.append('status', statusValue)
    formData.append('remarks', remarks)
    formData.append('id', id)

    try {
      const response = await api.put(url, formData, {
        headers: getHeaders('multi'),
      })
      if (response?.data) {
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      throw error
    }
  }
}

export const getClosedProductMemberActivity = (
  page,
  pageSize,
  category,
  status,
  productId,
  memberId,
) => {
  return (dispatch) => {
    // Ensure page is a number
    let pageNo = typeof page === 'number' ? page : 0

    // Ensure pageSize is a number
    let size = typeof pageSize === 'number' ? pageSize : 10 // Default to 10 if not a number

    // Construct the URL with proper encoding
    let url = `/common/timesheet/approval/owner/status?page=${encodeURIComponent(
      pageNo,
    )}&size=${encodeURIComponent(size)}&category=${encodeURIComponent(category)}`

    if (productId && productId !== 'undefined' && productId !== '') {
      url += `&productId=${encodeURIComponent(productId)}`
    } else {
      url += `&productId=0`
    }
    if (memberId && memberId !== 'undefined' && memberId !== '') {
      url += `&memberId=${encodeURIComponent(memberId)}`
    } else {
      url += `&memberId=0`
    }

    if (status && status !== 'undefined' && status !== '') {
      url += `&status=${encodeURIComponent(status)}`
    }
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: GET_PRODUCT_MEMBER_CLOSED_ACTIVITY,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}
