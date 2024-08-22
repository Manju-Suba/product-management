import { jwtDecode } from 'jwt-decode'

const BackEndBaseLink = 'http://localhost:8080/api/'
const ImageUrl = 'http://localhost:8080/api/assets/uploads/'

// const BackEndBaseLink = 'http://216.48.177.166/pmtool/'
// const ImageUrl = 'http://216.48.177.166/demo/neram/uploads/'

// const BackEndBaseLink = 'https://testing_demo.cavinkare.in/test_neram/'
// const ImageUrl = 'https://testing_demo.cavinkare.in/neram_backend/uploads/'

const hour = 11
const minute = 0
// const hour = 5
// const minute = 30

export { BackEndBaseLink, ImageUrl, hour, minute }

export const getToken = () => {
  const tokenString = localStorage.getItem('userData')
  return tokenString ? JSON.parse(tokenString) : { Token: '' }
}
export const getHeaders = (status) => {
  const tokenInfo = getToken()
  if (tokenInfo) {
    const contentType =
      status === 'json'
        ? { 'Content-Type': 'application/json' }
        : { 'Content-Type': 'multipart/form-data' }
    return {
      ...contentType,
    }
  }
}

export const getDecodeData = () => {
  const tokenInfo = getToken()
  const token = tokenInfo ? tokenInfo.Token : null

  if (!token) {
    return null
  } else {
    const decoded = jwtDecode(token)
    return decoded
  }
}

export const getSubPath = () => {
  const subPathValue = '/'
  // const subPathValue = '/neram'
  // const subPathValue = '/demo/product_management'

  return subPathValue
}
