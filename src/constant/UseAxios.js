import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
// import dayjs from 'dayjs'
import { getToken } from './Global'

const BackEndBaseLink = 'http://localhost:8080/api/'
// const BackEndBaseLink = 'http://216.48.177.166/pmtool/'
// const BackEndBaseLink = 'https://testing_demo.cavinkare.in/test_neram/'

const subPath = '/'
// const subPath = '/neram'
// const subPath = '/demo/product_management'

const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: BackEndBaseLink,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// const isTokenExpired = (exp) => {
//   return dayjs.unix(exp || 0).diff(dayjs()) < 1
// }

const logoutSession = () => {
  window.localStorage.clear()
  localStorage.removeItem('userData')
  localStorage.removeItem('logout')
  localStorage.removeItem('Pm_tool')
  localStorage.removeItem('neram')
  localStorage.clear()
  window.location.href = subPath
}

const useAxios = () => {
  const authTokens = getToken()

  const token = authTokens.Token

  const axiosInstance = createAxiosInstance(token)
  axiosInstance.interceptors.request.use(async (req) => {
    const isSignOutRequest = req.url.includes('auth/signout')
    if (isSignOutRequest) {
      req.headers = {} // Ensure headers are cleared for signout requests
      return req
    }

    try {
      if (token) {
        const decoded = jwtDecode(token)
        // Check if the 'exp' key is present in the token
        if (decoded.exp) {
          logoutSession() // Log out the user if 'exp' key is present
          return
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error)
      return req // Continue the request if there's an error decoding
    }

    return req
  })

  return axiosInstance
}

export default useAxios
