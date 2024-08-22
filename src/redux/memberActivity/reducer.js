import {
  GET_MEMBER_ACTIVITY,
  GET_CONTRACT_MEMBER_ACTIVITY,
  GET_CONTRACT_CLOSED_MEMBER_ACTIVITY,
  GET_OWNER_MEMBER_ACTIVITY,
  GET_PRODUCT_MEMBER_CLOSED_ACTIVITY,
} from '../actionType'
// import { getContractMemberActivity } from './action'

const initialState = {
  getMemberActivityData: [],
  contractMemberData: [],
  closedContractMemberData: [],
  ownerMemberData: [],
  closedProductMemberData: [],
}

const memberActivityReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MEMBER_ACTIVITY:
      return {
        ...state,
        getMemberActivityData: action.payload,
      }
    case 'CLEAR_MEMBER_ACTIVITY':
      return {
        ...state,
        getMemberActivityData: [],
      }
    case GET_CONTRACT_MEMBER_ACTIVITY:
      return {
        ...state,
        contractMemberData: action.payload,
      }
    case GET_CONTRACT_CLOSED_MEMBER_ACTIVITY:
      return {
        ...state,
        closedContractMemberData: action.payload,
      }
    case GET_OWNER_MEMBER_ACTIVITY:
      return {
        ...state,
        ownerMemberData: action.payload,
      }
    case GET_PRODUCT_MEMBER_CLOSED_ACTIVITY:
      return {
        ...state,
        closedProductMemberData: action.payload,
      }

    default:
      return state
  }
}

export default memberActivityReducer
