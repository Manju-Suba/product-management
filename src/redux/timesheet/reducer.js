import {
  APPROVED_PRODUCT_LIST,
  ATTENDANCE_SHEET,
  EDIT_SUBMITED_ACTIVITY,
  EXISTING_DATES,
  TASK_LIST,
  YESTERDAY_COUNT,
  GET_SUBMITTED_TIMESHEET,
  GET_RAISED_REQUEST,
  GET_LEAVE_HISTORY,
  SET_PENDING_DATA,
} from '../actionType'

const initialState = {
  approvedProductList: [],
  taskList: [],
  existingDates: [],
  yesterdayCount: [],
  attentance: [],
  submittedTimesheetList: [],
  raisedRequestList: [],
  leaveHistoryList: [],
  pendingData: [
    {
      isChecked: false,
      checkUser: '',
      product: '',
      task: '',
      hours: '',
      status: '',
      description: '',
    },
  ],
}

const timesheetReducer = (state = initialState, action) => {
  switch (action.type) {
    case APPROVED_PRODUCT_LIST:
      return {
        ...state,
        approvedProductList: action.payload,
      }
    case TASK_LIST:
      return {
        ...state,
        taskList: action.payload,
      }
    case EXISTING_DATES:
      return {
        ...state,
        existingDates: action.payload,
      }
    case YESTERDAY_COUNT:
      return {
        ...state,
        yesterdayCount: action.payload,
      }
    case GET_SUBMITTED_TIMESHEET:
      return {
        ...state,
        submittedTimesheetList: action.payload,
      }
    case GET_RAISED_REQUEST:
      return {
        ...state,
        raisedRequestList: action.payload,
      }
    case GET_LEAVE_HISTORY:
      return {
        ...state,
        leaveHistoryList: action.payload.content,
      }
    case ATTENDANCE_SHEET:
      return {
        ...state,
        attentance: action.payload,
      }
    case EDIT_SUBMITED_ACTIVITY:
      return {
        ...state,
        editSubmittedActivity: action.payload,
      }
    case SET_PENDING_DATA:
      return {
        ...state,
        pendingData: action.payload,
      }
    default:
      return state
  }
}

export default timesheetReducer
