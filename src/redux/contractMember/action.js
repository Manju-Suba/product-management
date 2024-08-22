import { GET_CONTRACT_MEMBER } from '../actionType'
import React from 'react'
import UseAxios from '../../constant/UseAxios'
const api = UseAxios()

export const getcontractMember = () => {
  return {
    type: GET_CONTRACT_MEMBER,
    payload: <></>,
  }
}
