import { GET_CONTRACT_MEMBER } from '../actionType'

const initialState = { getContractMember: [] }

const ContractMemberReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTRACT_MEMBER:
      return {
        ...state,
        getContractMember: action.payload,
      }

    default:
      return state
  }
}

export default ContractMemberReducer
