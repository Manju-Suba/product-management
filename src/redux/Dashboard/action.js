import {
  ASSIGNED_BY_OWNER,
  CONTRACT_AND_SUPERVISOR,
  COUNT_SIDEBAR,
  DESIGNATION_MEMBERS,
  FLOW_ACCESS,
  FLOW_COUNT_DATA,
  GET_PROFILE_PIC,
  MASTERS_COUNT,
  MEMBERS_ACTIVITY_COUNT,
  MEMBERS_ACTIVITY_SEC_LVL_COUNT,
  MEMBERS_ALL,
  MY_ACTIVITY_COUNT,
  MY_TIMESHEET_DETAILS,
  PIECHART_IMG,
  PRODUCT_ASSIGNED,
  PRODUCT_BY_HEAD,
  PRODUCT_COUNT_BY_APPROVER,
  SEQUENCE_LIST,
  SIDE_BAR_SHOW,
  TEAM_MEMBERS_COUNT,
  TIMESHEET_DAYS_COUNT,
  TIMESHEET_STATUS_CONTRACT,
  TIMESHEET_STATUS_ROLE_BASED,
  WEEKLY_TIMESHEET_HOURS,
} from '../actionType'
import PieChartIcon from 'src/views/Dashboard/DashboardSVG/PiechartSVG'
import React from 'react'
import UseAxios from '../../constant/UseAxios'
import { getDecodeData, getHeaders } from 'src/constant/Global'
import dayjs from 'dayjs'
import { createAsyncThunk } from '@reduxjs/toolkit'
const api = UseAxios()
const user = getDecodeData()
const empId = user?.employee_id

export const setPieChartSVG = () => {
  return {
    type: PIECHART_IMG,
    payload: (
      <PieChartIcon width="16" height="15" viewBox="0 0 18 18" fill="" stopColor="#F91414" />
    ),
  }
}

export const toggleSideBar = (sidebarShow) => ({
  type: SIDE_BAR_SHOW,
  sidebarShow,
})

export const getFlowsCount = () => {
  return (dispatch) => {
    const url = `dashboard/flows-status-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: FLOW_COUNT_DATA,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getMembersByDesignation = () => {
  return (dispatch) => {
    const url = `dashboard/members-with-designation-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: DESIGNATION_MEMBERS,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getMembersAll = () => {
  return (dispatch) => {
    const url = `dashboard/members-status-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: MEMBERS_ALL,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getSequenceList = () => {
  return (dispatch) => {
    const url = `dashboard/dashboard-sequence-list`
    const response = api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        dispatch({
          type: SEQUENCE_LIST,
          payload: response.data.data,
        })
      })
    return response
  }
}

export const getProductByHead = () => {
  return (dispatch) => {
    const url = `dashboard/product-status-wise-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: PRODUCT_BY_HEAD,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getProductAssigned = () => {
  return (dispatch) => {
    const url = `dashboard/product-assigned-to-owner-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: PRODUCT_ASSIGNED,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getFlowAccess = () => {
  return (dispatch) => {
    const url = `dashboard/flow-access-count-head`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: FLOW_ACCESS,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getProductAssignedByOwner = () => {
  return (dispatch) => {
    const url = `dashboard/assigned-unassigned-product-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: ASSIGNED_BY_OWNER,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getMembersActivityBySup = () => {
  return (dispatch) => {
    const url = `dashboard/team-member-activity`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: MEMBERS_ACTIVITY_COUNT,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getMembersActivityBySupAndSecLvl = () => {
  return (dispatch) => {
    const url = `dashboard/sec-level-submitted-activity-status-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: MEMBERS_ACTIVITY_SEC_LVL_COUNT,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getTeamMemberCount = () => {
  return (dispatch) => {
    const url = `dashboard/team-member-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: TEAM_MEMBERS_COUNT,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getMyActivityCount = () => {
  return (dispatch) => {
    const url = `dashboard/submitted-activity-status-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: MY_ACTIVITY_COUNT,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getProductCountByApprover = () => {
  return (dispatch) => {
    const url = `dashboard/approver-approved-rejected-product-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: PRODUCT_COUNT_BY_APPROVER,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getTimesheetSummary = (month, year) => {
  return (dispatch) => {
    const url = `dashboard/timesheet-entry-days-count-per-month?month=${month}&year=${year}`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: TIMESHEET_DAYS_COUNT,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getMyTimesheetDetails = (filter, date) => {
  const parsedDate = dayjs(date, 'DD MMM, YYYY')
  const formattedDate = parsedDate.format('YYYY-MM-DD')
  return (dispatch) => {
    const url = `dashboard/get-my-timesheet-details?filterValue=${filter}&date=${formattedDate}`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: MY_TIMESHEET_DETAILS,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getTimesheetStatusBasedType = (page, search, type, filterValue) => {
  return (dispatch) => {
    let url
    if (filterValue !== '') {
      url = `dashboard/role-based-timesheet-details?page=${page}&size=10&search=${search}&memberType=${type}&value=${filterValue}`
    } else {
      url = `dashboard/role-based-timesheet-details?page=${page}&size=10&search=${search}&memberType=${type}`
    }
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: type === 'Contract' ? TIMESHEET_STATUS_CONTRACT : TIMESHEET_STATUS_ROLE_BASED,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getcontracterAndSupervisor = () => {
  return (dispatch) => {
    const url = `dashboard/dashboard-contract-user-supervisor-list`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: CONTRACT_AND_SUPERVISOR,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const getMyWorkingHours = (startWeek, endWeek) => {
  return (dispatch) => {
    const url = `dashboard/dashboard-weekly-based-timeline?fromdate=${startWeek}&todate=${endWeek}`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: WEEKLY_TIMESHEET_HOURS,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const setDragItem = (itemType, title, index, status) => ({
  type: 'SET_DRAG_ITEM',
  payload: { itemType, title, index, status },
})

export const setLoader = (value) => ({
  type: 'SET_LOADER',
  payload: value,
})

export const setDefaultData = (data) => ({
  type: 'DEFAULT_DATA',
  payload: data,
})

export const updateTitle = (index, title, type, dataList, key) => (dispatch, getState) => {
  const user = getDecodeData()
  const empId = user?.employee_id

  let replaceFrom

  // Determine replaceFrom based on state.sequenceList and state.dragItem.itemType
  if (dataList && dataList.length > 0) {
    if (type === 'widgetCount') {
      replaceFrom = dataList[0].widgetCount[index]
    } else if (type === 'widgetTable') {
      replaceFrom = dataList[0].widgetTable[index]
    }
  }
  const data = {
    data: {
      empId: empId,
      replacementType: type,
      replaceFrom: replaceFrom,
      replaceTo: title,
    },
    key: key,
  }
  const updatedSwapItemList = {
    type: 'UPDATE_TITLE',
    payload: data,
  }
  dispatch(updatedSwapItemList)
  const response = updateSequenceList(data)
  return response
}

export const updateSequenceList = (data) => {
  const url = `dashboard/dashboard-sequence-update?key=${data.key}`
  const response = api.put(url, data.data, {
    headers: getHeaders('json'),
  })
  return response
}

export const getMastersCount = () => {
  return (dispatch) => {
    const url = `dashboard/master-category-count`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: MASTERS_COUNT,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}

export const countSidebar = () => ({
  type: COUNT_SIDEBAR,
})

export const restoreDefaultWidgets = createAsyncThunk(
  'dashboard/restoreDefaultWidgets',
  async (data, { rejectWithValue }) => {
    const url = `dashboard/dashboard-default-page-update`
    try {
      const response = await api.put(url, data, {
        headers: getHeaders('json'),
      })
      if (response?.data) {
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const getProfilePic = () => {
  return (dispatch) => {
    const url = `/master/employee/profilepic?empid=${empId}`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((res) => {
        dispatch({
          type: GET_PROFILE_PIC,
          payload: res.data.data,
        })
      })
      .catch((error) => {})
  }
}
