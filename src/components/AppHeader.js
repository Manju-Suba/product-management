import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CHeaderNav,
  CNavItem,
  CTooltip,
  CDropdownToggle,
  CDropdownItem,
  CDropdown,
  CDropdownMenu,
  CCol,
} from '@coreui/react'
import logo from '../assets/images/Neram logo1.png'
import '../assets/css/common.css'
import { AppHeaderDropdown } from './header/index'
import headerimage from '../assets/images/Headerimage.png'
import { getDecodeData, getToken, getSubPath } from '../../src/constant/Global'
import useAxios from 'src/constant/UseAxios'
import logouticon from '../assets/images/form/logout-iocn.png'
import { toPascalCase } from 'src/constant/TimeUtils'
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi'
import { Menu, Dropdown, Button } from 'antd'
import { getProfilePic, toggleSideBar } from 'src/redux/Dashboard/action'
import { useDispatch, useSelector } from 'react-redux'
// import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'
// import useSessionTimeout from '../views/auth/login/useSessionTimeout'

const AppHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const subPath = getSubPath()
  let api = useAxios()
  const [activeMenu, setActiveMenu] = useState('Products')
  const [productRoute, setProductRoute] = useState()
  const user = getDecodeData()
  const logout = localStorage.getItem('logout')
  // const roleIntake = user?.roleIntake
  const designation = user?.designation
  const supervisor = user?.superviser
  const finalApprover = user?.finalApprover
  const Token = getToken()
  const tokenlogout = Token.Token
  const userNameRef = useRef(null)
  const roleNameRef = useRef(null)
  const dispatch = useDispatch()
  // Use session timeout with refresh at 30 minutes and logout at 2 hours
  // useSessionTimeout()

  const microsoftProfilePic = useSelector((state) => state.dashboard?.microsoftProfilePic)

  useEffect(() => {
    const neram = localStorage.getItem('neram')
    if (!neram || neram !== 'true') {
      return logoutSession()
    }
    if (user === null) {
      navigate('/')
    } else {
      if (
        designation.includes('Admin') &&
        !designation.includes('Internal Admin') &&
        !designation.includes('QA Admin')
      ) {
        setProductRoute('/flow')
      } else {
        setProductRoute('/product/list')
      }
    }

    if (location.pathname === '/tm-activity') {
      setActiveMenu('TL_Activity')
    }
    if (location.pathname === productRoute) {
      setActiveMenu('Products')
    }
    if (location.pathname === '/timesheet') {
      setActiveMenu('Timesheet')
    }
    if (location.pathname === '/master') {
      setActiveMenu('Masters')
    }
    if (location.pathname === '/report') {
      setActiveMenu('Report')
    }
    if (location.pathname === '/view-report') {
      setActiveMenu('Report')
    }
    if (location.pathname === '/members-activity') {
      setActiveMenu('MembersActivity')
    }
    if (location.pathname === '/contract-members-activity') {
      setActiveMenu('ContractMembersActivity')
    }
    if (location.pathname === '/product-members-activity') {
      setActiveMenu('ProductMembersActivity')
    }
    if (location.pathname === '/dashboard') {
      setActiveMenu('Dashboard')
    }
    if (location.pathname === '/history') {
      setActiveMenu('History')
    }
    if (location.pathname === '/self-activity') {
      setActiveMenu('SelfActivity')
    }
    const adjustMargin = () => {
      const userName = userNameRef.current
      const roleName = roleNameRef.current
      if (userName) {
        const marginLeftValue = userName.offsetWidth - 68 // Adjust the constant value as needed
        const marginLeftValue1 = roleName.offsetWidth - 68
        userName.style.marginLeft = `${-marginLeftValue}px`
        roleName.style.marginLeft = `${-marginLeftValue1}px`
      }
    }
    adjustMargin()
    window.addEventListener('resize', adjustMargin)
    return () => {
      window.removeEventListener('resize', adjustMargin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const logoutSession = () => {
    window.localStorage.clear()
    localStorage.removeItem('userData')
    localStorage.removeItem('logout')
    localStorage.removeItem('Pm_tool')
    localStorage.removeItem('neram')
    localStorage.clear()
    window.location.href = subPath
  }
  const handleLogout = async () => {
    await api.post(`auth/signout?logout=${logout}`, {}).then((response) => {
      window.localStorage.clear()
      localStorage.removeItem('userData')
      localStorage.removeItem('neram')
      localStorage.removeItem('logout')
      localStorage.removeItem('Pm_tool')
      localStorage.clear()
      window.location.href = response.data
    })
  }
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuMblVisible, setMenuMblVisible] = useState(false)

  const handleMenuClick = () => {
    setMenuVisible(!menuVisible)
  }

  const handleMenuItemClick = () => {
    setMenuMblVisible(!menuMblVisible)
  }
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 900) {
        setMenuMblVisible(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activeMenu !== 'Dashboard') {
      dispatch(toggleSideBar(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, activeMenu])

  const shouldShowMenuItem =
    designation?.includes('Admin') &&
    !designation?.includes('Internal Admin') &&
    !designation.includes('QA Admin')

  useEffect(() => {
    dispatch(getProfilePic())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const menu = (
    <Menu onClick={handleMenuItemClick} className="mbl-open">
      {!user?.designation?.includes('Internal Admin') && (
        <>
          <Menu.Item key="setting:4" className="mbl-menu-item">
            <Link className={'menu-items-mbl'} to={'/dashboard'} onClick={() => handleMenuClick()}>
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key="setting:5" className="mbl-menu-item">
            <Link className={'menu-items-mbl'} to={'/timesheet'} onClick={() => handleMenuClick()}>
              Timesheet
            </Link>
          </Menu.Item>
        </>
      )}
      {!user?.designation?.includes('Internal Admin') && (
        <Menu.Item key="setting:6" className="mbl-menu-item">
          <Link
            // style={{ width: '150px' }}
            className={'menu-items-mbl'}
            to={'/report'}
            onClick={() => handleMenuClick()}
          >
            Report
          </Link>
        </Menu.Item>
      )}
      {shouldShowMenuItem && (
        <div>
          <Menu.Item key="setting:1" className="mbl-menu-item">
            <Link
              // style={{ width: '100px' }}
              className={'menu-items-mbl'}
              to={productRoute}
              onClick={() => handleMenuClick()}
            >
              {user?.designation?.includes('Admin') && !user?.designation?.includes('QA Admin')
                ? 'Flow'
                : 'Products'}
            </Link>
          </Menu.Item>
        </div>
      )}

      {(user?.designation?.includes('Admin') || user?.employee_id === '120034') &&
        !user?.designation?.includes('QA Admin') && (
          <div>
            <Menu.Item key="setting:2" className="mbl-menu-item">
              <Link className={'menu-items-mbl'} to={'/master'} onClick={() => handleMenuClick()}>
                Masters
              </Link>
            </Menu.Item>
          </div>
        )}

      {supervisor === 'true' && (
        <>
          <Menu.Item key="setting:7" className="mbl-menu-item">
            <Link
              // style={{ width: '150px' }}
              className={'menu-items-mbl'}
              to={'/members-activity'}
              onClick={() => handleMenuClick()}
            >
              Member&apos;s Activity
            </Link>
          </Menu.Item>
          <Menu.Item key="setting:7" className="mbl-menu-item">
            <Link
              // style={{ width: '150px' }}
              className={'menu-items-mbl'}
              to={'/history'}
              onClick={() => handleMenuClick()}
            >
              History
            </Link>
          </Menu.Item>
          <Menu.Item key="setting:7" className="mbl-menu-item">
            <Link
              // style={{ width: '150px' }}
              className={'menu-items-mbl'}
              to={'/self-activity'}
              onClick={() => handleMenuClick()}
            >
              Self Activity
            </Link>
          </Menu.Item>
        </>
      )}
      {finalApprover === 'true' && (
        <Menu.Item key="setting:8" className="mbl-menu-item">
          <Link
            // style={{ width: '150px' }}
            className={'menu-items-mbl'}
            to={'/contract-members-activity'}
            onClick={() => handleMenuClick()}
          >
            Contract Member&rsquo;s Activity
          </Link>
        </Menu.Item>
      )}
      {designation?.includes('Owner') && (
        <Menu.Item key="setting:3" className="mbl-menu-item">
          <Link
            // style={{ width: '150px' }}
            className={'menu-items-mbl'}
            to={'/product-members-activity'}
            onClick={() => handleMenuClick()}
          >
            Product Member&rsquo;s Activity
          </Link>
        </Menu.Item>
      )}
    </Menu>
  )
  const getColumnWidth = () => {
    return window.innerWidth <= 1280 ? 8 : 7
  }

  const [columnWidth, setColumnWidth] = useState(getColumnWidth)

  useEffect(() => {
    const handleResize = () => {
      setColumnWidth(getColumnWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      <div
        className=" header_bg_image "
        style={{
          // position: 'sticky',
          backgroundSize: 'cover',
          backgroundPosition: 'start',
          height: '100px',
          top: 0,
          bottom: -1,
          zIndex: 999,
          backgroundImage: `url(${headerimage})`,
        }}
      >
        <CCol sm={12} md={12} lg={12}>
          <CContainer fluid style={{ display: 'flex', alignItems: 'center', border: 'none' }}>
            <CCol sm={1}>
              <CHeaderNav className="neram_logo">
                <img src={logo} alt="Logo" />
              </CHeaderNav>
            </CCol>
            <CCol sm={7} md={columnWidth}>
              <CHeaderNav
                className="me-auto"
                style={{
                  marginLeft: '3%',
                  marginTop: '-15px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {!user?.designation?.includes('Internal Admin') &&
                  !user?.designation?.includes('QA Admin') && (
                    <div>
                      <CNavItem
                        className={` ${activeMenu === 'Dashboard' ? 'aactive' : 'mbl-menu-item'}`}
                      >
                        <Link
                          className={`menu-items ${
                            activeMenu === 'Dashboard' ? 'aactive' : ''
                          } text-decoration-none ${
                            activeMenu === 'Dashboard' ? 'menu-text-active' : 'menu-text'
                          }
              ${activeMenu === 'Dashboard' ? 'activetitle' : 'none'}
              `}
                          to={'/dashboard'}
                        >
                          Dashboard
                        </Link>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <div
                            className={` ${
                              activeMenu === 'Dashboard' ? 'header-title-bottom' : ''
                            }`}
                          ></div>
                        </div>
                      </CNavItem>
                    </div>
                  )}
                {shouldShowMenuItem && (
                  <div>
                    <CNavItem
                      className={` ${activeMenu === 'Products' ? 'aactive' : 'mbl-menu-item'}`}
                    >
                      <Link
                        className={`menu-items ${
                          activeMenu === 'Products bottom-border' ? 'aactive bottom-border' : ''
                        }
                    text-decoration-none ${
                      activeMenu === 'Products' ? 'menu-text-active' : 'menu-text'
                    }
                    `}
                        to={productRoute}
                        onClick={() => handleMenuClick()}
                      >
                        {user?.designation?.includes('Admin') ? 'Flow' : 'Products'}
                      </Link>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div
                          className={` ${activeMenu === 'Products' ? 'header-title-bottom' : ''}`}
                        ></div>
                      </div>
                    </CNavItem>
                  </div>
                )}
                {!user?.designation?.includes('Internal Admin') &&
                  !user?.designation?.includes('QA Admin') && (
                    <CNavItem
                      className={` ${activeMenu === 'Timesheet' ? 'aactive' : 'mbl-menu-item'}`}
                    >
                      <Link
                        className={`menu-items ${
                          activeMenu === 'Timesheet' ? 'aactive' : ''
                        } text-decoration-none ${
                          activeMenu === 'Timesheet' ? 'menu-text-active' : 'menu-text'
                        }
              ${activeMenu === 'Timesheet' ? 'activetitle' : 'none'}
              `}
                        to={'/timesheet'}
                        onClick={() => handleMenuClick()}
                      >
                        Time Sheet
                      </Link>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div
                          className={` ${activeMenu === 'Timesheet' ? 'header-title-bottom' : ''}`}
                        ></div>
                      </div>
                    </CNavItem>
                  )}
                {(user?.designation?.includes('Admin') || user?.employee_id === '120034') &&
                  !user?.designation?.includes('QA Admin') && (
                    <div>
                      <CNavItem
                        className={` ${activeMenu === 'Masters' ? 'aactive' : 'mbl-menu-item'}`}
                      >
                        <Link
                          className={`menu-items ${
                            activeMenu === 'Masters' ? 'aactive' : ''
                          } text-decoration-none ${
                            activeMenu === 'Masters' ? 'menu-text-active' : 'menu-text'
                          }`}
                          to={'/master'}
                          onClick={() => handleMenuClick()}
                        >
                          Masters
                        </Link>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                          <div
                            className={` ${activeMenu === 'Masters' ? 'header-title-bottom' : ''}`}
                          ></div>
                        </div>
                      </CNavItem>
                    </div>
                  )}
                {!user?.designation?.includes('Internal Admin') && (
                  <CNavItem className={` ${activeMenu === 'Report' ? 'aactive' : 'mbl-menu-item'}`}>
                    <Link
                      className={`menu-items ${
                        activeMenu === 'Report' ? 'aactive' : ''
                      } text-decoration-none ${
                        activeMenu === 'Report' ? 'menu-text-active' : 'menu-text'
                      }`}
                      to={'/report'}
                      onClick={() => handleMenuClick()}
                    >
                      Report
                    </Link>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <div
                        className={` ${activeMenu === 'Report' ? 'header-title-bottom' : ''}`}
                      ></div>
                    </div>
                  </CNavItem>
                )}
                {supervisor === 'true' && (
                  <>
                    <CNavItem
                      className={` ${
                        activeMenu === 'MembersActivity' ? 'aactive' : 'mbl-menu-item'
                      }`}
                    >
                      <Link
                        className={`menu-items ${
                          activeMenu === 'MembersActivity' ? 'aactive' : ''
                        } text-decoration-none ${
                          activeMenu === 'MembersActivity' ? 'menu-text-active' : 'menu-text'
                        }`}
                        to="/members-activity"
                        onClick={handleMenuClick}
                      >
                        Member&apos;s Activity
                      </Link>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div
                          className={` ${
                            activeMenu === 'MembersActivity' ? 'header-title-bottom' : ''
                          }`}
                        ></div>
                      </div>
                    </CNavItem>
                    <CNavItem
                      className={` ${activeMenu === 'History' ? 'aactive' : 'mbl-menu-item'}`}
                    >
                      <Link
                        className={`menu-items ${
                          activeMenu === 'History' ? 'aactive' : ''
                        } text-decoration-none ${
                          activeMenu === 'History' ? 'menu-text-active' : 'menu-text'
                        }`}
                        to="/history"
                        onClick={handleMenuClick}
                      >
                        History
                      </Link>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div
                          className={` ${activeMenu === 'History' ? 'header-title-bottom' : ''}`}
                        ></div>
                      </div>
                    </CNavItem>
                    <CNavItem
                      className={` ${activeMenu === 'SelfActivity' ? 'aactive' : 'mbl-menu-item'}`}
                    >
                      <Link
                        className={`menu-items ${
                          activeMenu === 'SelfActivity' ? 'aactive' : ''
                        } text-decoration-none ${
                          activeMenu === 'SelfActivity' ? 'menu-text-active' : 'menu-text'
                        }`}
                        to="/self-activity"
                        onClick={handleMenuClick}
                      >
                        Self Activity
                      </Link>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div
                          className={` ${
                            activeMenu === 'SelfActivity' ? 'header-title-bottom' : ''
                          }`}
                        ></div>
                      </div>
                    </CNavItem>
                  </>
                )}
                {finalApprover === 'true' && (
                  <CNavItem
                    className={` ${
                      activeMenu === 'ContractMembersActivity' ? 'aactive' : 'mbl-menu-item'
                    }`}
                  >
                    <Link
                      className={`menu-items ${
                        activeMenu === 'MembersActivity' ? 'aactive' : ''
                      } text-decoration-none ${
                        activeMenu === 'ContractMembersActivity' ? 'menu-text-active' : 'menu-text'
                      }`}
                      to={'/contract-members-activity'}
                      onClick={() => handleMenuClick()}
                    >
                      Contract Member&rsquo;s Activity
                    </Link>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <div
                        className={` ${
                          activeMenu === 'ContractMembersActivity' ? 'header-title-bottom' : ''
                        }`}
                      ></div>
                    </div>
                  </CNavItem>
                )}
                {designation?.includes('Owner') && (
                  <CNavItem
                    className={` ${
                      activeMenu === 'ProductMembersActivity' ? 'aactive' : 'mbl-menu-item'
                    }`}
                  >
                    <Link
                      className={`menu-items ${
                        activeMenu === 'MembersActivity' ? 'aactive' : ''
                      } text-decoration-none ${
                        activeMenu === 'ProductMembersActivity' ? 'menu-text-active' : 'menu-text'
                      }`}
                      to={'/product-members-activity'}
                      onClick={() => handleMenuClick()}
                    >
                      Product Member&rsquo;s Activity
                    </Link>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <div
                        className={` ${
                          activeMenu === 'ProductMembersActivity' ? 'header-title-bottom' : ''
                        }`}
                      ></div>
                    </div>
                  </CNavItem>
                )}
              </CHeaderNav>
            </CCol>
            <CCol sm={1} className="icon_style notification_icon">
              <Dropdown
                overlay={menu}
                trigger={['click']}
                open={menuMblVisible}
                onOpenChange={handleMenuItemClick}
              >
                <Button onClick={handleMenuItemClick} icon={<PiDotsThreeOutlineVerticalFill />} />
              </Dropdown>
            </CCol>
            <CCol>
              <CHeaderNav
                className=" admin-box "
                style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
              >
                <div className="profile_image">
                  <AppHeaderDropdown profilePic={microsoftProfilePic} />
                </div>
                <div className="user-name-box">
                  <CTooltip
                    content={user && toPascalCase(user.name)}
                    trigger={['hover', 'focus']}
                    placement="bottom"
                  >
                    <p className="user-name" ref={userNameRef}>
                      {user?.name ? toPascalCase(user.name) : ''}
                    </p>
                  </CTooltip>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      marginLeft: '10px',
                      zIndex: '1',
                      height: '16px',
                    }}
                  >
                    <CDropdown>
                      <CDropdownToggle className="dropdown"></CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem
                          style={{ cursor: 'pointer' }}
                          onClick={handleLogout}
                          className="drapdown-logout"
                        >
                          <img
                            src={logouticon}
                            alt={logouticon}
                            style={{ width: '18px', height: '18px', marginRight: '10px' }}
                          />
                          Logout
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </div>

                  <CTooltip content={user?.role} trigger={['hover', 'focus']} placement="bottom">
                    <p className="role-text" ref={roleNameRef}>
                      {user?.role ? user.role : ''}
                    </p>
                  </CTooltip>
                </div>
              </CHeaderNav>
            </CCol>
          </CContainer>
        </CCol>
      </div>
    </div>
  )
}

export default AppHeader
