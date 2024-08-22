import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { BackEndBaseLink, getDecodeData } from '../../../constant/Global'
import './Login.css'
import logoimg from '../../../assets/images/login/logo.png'
import sideImg from '../../../assets/images/login/sideImg.png'
import passwordIcon from '../../../assets/images/login/Show.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import queryString from 'query-string'
import microsoftlogin from '../../../assets/images/login/microsoft-logo.png'
import { jwtDecode } from 'jwt-decode'
import { Button, Form, Input } from 'antd'
import useAxios from 'src/constant/UseAxios'
import { EyeInvisibleOutlined } from '@ant-design/icons'

const Login = () => {
  const api = useAxios()
  const navigate = useNavigate()
  const [, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  useEffect(() => {
    // Parse URL parameters using query-string
    const urlParams = queryString.parse(window.location.search)
    const tokenstatus = urlParams.RefreshToken
    let tokencode
    if (typeof tokenstatus === 'string') {
      const decoded = jwtDecode(tokenstatus)
      if ('code' in decoded) {
        tokencode = decoded.code
      }
    }
    const user = getDecodeData()
    if (tokencode === 200) {
      localStorage.setItem('userData', JSON.stringify(urlParams))
      localStorage.setItem('Pm_tool', 'true')
      localStorage.setItem('logout', 'outlook')
      localStorage.setItem('neram', 'true')
      const newUrl = window.location.origin + window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
      if (user?.designation.includes('Internal Admin')) {
        navigate('/master')
      } else if (user?.designation.includes('QA Admin')) {
        navigate('/report')
      } else {
        navigate('/dashboard')
      }
    } else if (user !== null) {
      if (user?.designation.includes('Internal Admin')) {
        navigate('/master')
      } else if (user?.designation.includes('QA Admin')) {
        navigate('/report')
      } else {
        navigate('/dashboard')
      }
    } else if (tokencode) {
      toast.error('User Not Found', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      })
      const redirectUrl = new URLSearchParams(window.location.search).get('redirectUrl')
      navigate(redirectUrl || '/')
    }
  }, [navigate])

  // Set cookies
  const cookies = new Cookies()
  const [loadings, setLoadings] = useState(false)

  const onFinish = async (values) => {
    setLoadings(true)
    const url = 'auth/signin'
    try {
      const response = await api.post(url, values)

      if (response.status === 200) {
        const data = response.data.data

        localStorage.setItem('logout', 'local')
        localStorage.setItem('neram', 'true')
        localStorage.setItem('userData', JSON.stringify(data))
        const decodeToken = jwtDecode(data.Token)
        cookies.set('token', data.Token)
        toast.success('Login Successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 200,
          onClose: () => {
            setLoadings(false)
            if (decodeToken.designation.includes('Internal Admin')) {
              navigate('/master')
            } else if (decodeToken.designation.includes('QA Admin')) {
              navigate('/report')
            } else {
              navigate('/dashboard')
            }
          },
        })
      } else {
        setLoadings(false)
        toast.error('Login Failed', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      }
    } catch (error) {
      const err = error.response ? error.response.data : error.message
      setLoadings(false)
      if (err.data === 'Bad credentials') {
        toast.error('Incorrect Employee Id and Password', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      } else {
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      }
    }
  }
  const handlemicrosoftClick = () => {
    const url = BackEndBaseLink + `oauth2/authorization/azure-dev`
    window.location.href = url
  }

  return (
    <>
      <ToastContainer />
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex h-100">
            <div className="col-md-6 col-lg-6 col-sm-12 login-image-side">
              <div className="row">
                <img src={logoimg} alt="Neram-Logo" className="login-logo" />
              </div>
              <div className="row text-center">
                <p style={{ fontSize: '39px', fontWeight: '700', lineHeight: '52px' }}>
                  <span style={{ color: '#800000' }}>Unlock your </span>
                  <br />
                  <span style={{ color: '#F49292', marginLeft: '17px' }}>Performance </span>
                </p>
              </div>
              <div className="row d-flex justify-content-center">
                <img src={sideImg} alt="Neram-Logo" className="side-img" />
              </div>
            </div>
            <div
              className="col-md-6 col-lg-6 col-sm-12"
              style={{
                background: '#F3F4F5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div>
                <p
                  className="welcome-font"
                  style={{
                    color: '#800000',
                    fontSize: '37px',
                    lineHeight: '20px',
                    fontWeight: '700',
                  }}
                >
                  Welcome to Neram
                </p>
                <h6
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#F49292',
                    lineHeight: '20px',
                    marginBottom: '29px',
                  }}
                >
                  Unlock your team performance{' '}
                </h6>
                <Form
                  name="basic"
                  initialValues={{
                    remember: true,
                  }}
                  size="large"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter your Employee Id!',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Employee Id"
                      style={{ border: '1px solid #F20D2F', borderRadius: '5px' }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter your password!',
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Password"
                      iconRender={(visible) =>
                        visible ? (
                          <EyeInvisibleOutlined
                            onClick={togglePasswordVisibility}
                            style={{ color: '#F30D2F' }}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            <img src={passwordIcon} alt="Password" width={14} />
                          </button>
                        )
                      }
                      style={{ border: '1px solid #F20D2F', borderRadius: '5px' }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      className="btn-white"
                      style={{
                        textTransform: 'none',
                        color: '#FFFFFF',
                        background: '#F30D2F',
                        fontSize: '14px',
                        fontWeight: '700',
                        borderRadius: '5px',
                        height: '46px',
                        width: '100%',
                        border: 'none',
                      }}
                      htmlType="submit"
                      loading={loadings}
                    >
                      Login
                    </Button>
                  </Form.Item>
                  {/* <Form.Item>
                    <Button
                      className="btn-white"
                      style={{
                        textTransform: 'none',
                        color: '#FFFFFF',
                        background: '#F30D2F',
                        fontSize: '14px',
                        fontWeight: '700',
                        borderRadius: '5px',
                        height: '60px',
                        width: '100%',
                        border: 'none',
                      }}
                      onClick={handlemicrosoftClick}
                    >
                      <img
                        src={microsoftlogin}
                        alt="Microsoft Logo"
                        style={{ marginRight: '9px', width: '20px', height: '20px' }}
                      />
                      Sign in with Microsoft
                    </Button>
                  </Form.Item> */}
                </Form>
                {/* <h6
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '400',
                    color: '#F49292',
                    lineHeight: '20px',
                  }}
                >
                  © 2023 all rights reserved
                </h6> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
