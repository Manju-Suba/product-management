import {
  ASSIGNED_BY_OWNER,
  CONTRACT_AND_SUPERVISOR,
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
  UPDATED_SEQUENCE,
  WEEKLY_TIMESHEET_HOURS,
} from '../actionType'

const initialState = {
  pieChartimg: null,
  flowCountData: [],
  designationMember: [],
  membersAll: [],
  sequenceList: [],
  productByHead: [],
  productAssigned: [],
  flowAccess: [],
  assignedByOwner: [],
  membersActivityCount: [],
  membersActivitySecLvlCount: [],
  teamMembersCount: [],
  myActivityCount: [],
  sidebarShow: false,
  productCountByApprover: [],
  timesheetDaysCount: [],
  designationCount: [],
  taskGroupCount: [],
  businessCount: [],
  myTimesheetDetails: [],
  widgets: [],
  contractAndSupervisor: [],
  dragItem: {
    itemType: null,
    title: null,
    index: null,
    status: null,
  },
  swapItemList: [],
  updateSequenceSuccess: false,
  setloader: true,
  mastersCount: [],
  defaultData: [],
  updateSequenceData: null,
  count: 0,
  timesheetStatusRoleBased: [],
  timesheetStatusContract: [],
  microsoftProfilePic: {},
}

const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case PIECHART_IMG:
      return {
        ...state,
        pieChartimg: action.payload,
      }
    case FLOW_COUNT_DATA:
      return {
        ...state,
        flowCountData: action.payload,
      }
    case DESIGNATION_MEMBERS:
      return {
        ...state,
        designationMember: action.payload,
      }
    case MEMBERS_ALL:
      return {
        ...state,
        membersAll: action.payload,
      }
    case SEQUENCE_LIST:
      return {
        ...state,
        sequenceList: action.payload,
      }
    case PRODUCT_BY_HEAD:
      return {
        ...state,
        productByHead: action.payload,
      }
    case PRODUCT_ASSIGNED:
      return {
        ...state,
        productAssigned: action.payload,
      }
    case FLOW_ACCESS:
      return {
        ...state,
        flowAccess: action.payload,
      }
    case ASSIGNED_BY_OWNER:
      return {
        ...state,
        assignedByOwner: action.payload,
      }
    case MEMBERS_ACTIVITY_COUNT:
      return {
        ...state,
        membersActivityCount: action.payload,
      }
    case MEMBERS_ACTIVITY_SEC_LVL_COUNT:
      return {
        ...state,
        membersActivitySecLvlCount: action.payload,
      }
    case TEAM_MEMBERS_COUNT:
      return {
        ...state,
        teamMembersCount: action.payload,
      }
    case MY_ACTIVITY_COUNT:
      return {
        ...state,
        myActivityCount: action.payload,
      }
    case SIDE_BAR_SHOW:
      return {
        ...state,
        sidebarShow: action.sidebarShow,
      }
    case PRODUCT_COUNT_BY_APPROVER:
      return {
        ...state,
        productCountByApprover: action.payload,
      }
    case TIMESHEET_DAYS_COUNT:
      return {
        ...state,
        timesheetDaysCount: action.payload,
      }
    case MY_TIMESHEET_DETAILS:
      return {
        ...state,
        myTimesheetDetails: action.payload,
      }
    case TIMESHEET_STATUS_ROLE_BASED:
      return {
        ...state,
        timesheetStatusRoleBased: action.payload,
      }
    case TIMESHEET_STATUS_CONTRACT:
      return {
        ...state,
        timesheetStatusContract: action.payload,
      }
    case CONTRACT_AND_SUPERVISOR:
      return {
        ...state,
        contractAndSupervisor: action.payload,
      }
    case WEEKLY_TIMESHEET_HOURS:
      return {
        ...state,
        weeklyTimesheetHours: action.payload,
      }
    case 'SET_DRAG_ITEM':
      return {
        ...state,
        dragItem: {
          itemType: action.payload.itemType,
          title: action.payload.title,
          index: action.payload.index,
          status: action.payload.status,
        },
      }
    case 'UPDATE_TITLE': {
      return {
        ...state,
        updateSequenceData: action.payload,
      }
    }
    case UPDATED_SEQUENCE:
      return {
        ...state,
        updateSequenceSuccess: action.payload,
      }
    case 'CLEAR_SWAP_ITEM_LIST':
      return {
        ...state,
        swapItemList: [],
      }
    case 'SET_LOADER':
      return {
        ...state,
        setloader: action.payload,
      }
    case 'DEFAULT_DATA':
      return {
        ...state,
        defaultData: action.payload,
      }
    case MASTERS_COUNT:
      return {
        ...state,
        mastersCount: action.payload,
      }
    case 'COUNT_SIDEBAR':
      return {
        ...state,
        count: state.count + 1,
      }
    case GET_PROFILE_PIC:
      return {
        ...state,
        microsoftProfilePic: action.payload,
      }
    default:
      return state
  }
}

export default DashboardReducer
