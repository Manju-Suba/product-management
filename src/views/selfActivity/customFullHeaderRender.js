import React, { useState, useEffect, useRef } from 'react'
import { Select, Skeleton } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import Downarrowimg from '../../assets/images/arrows.png'
import useAxios from 'src/constant/UseAxios'
import { getHeaders, ImageUrl } from 'src/constant/Global'
import { CCol, CRow } from '@coreui/react'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import PropTypes from 'prop-types'

const CustomFullHeaderRender = ({ value, onChange, handleData }) => {
  const [memberLoader, setMemberLoader] = useState(false)

  const fullDayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const [memberList, setMemberList] = useState([])
  let api = useAxios()
  const memberIdRef = useRef('')

  const month = value.month()

  const onMonthChange = (newMonth) => {
    const newValue = value.clone().month(newMonth)
    onChange(newValue)
  }

  const handleMember = (value) => {
    const ids = Number(memberList.find((user) => user.name === value)?.id || '')
    memberIdRef.current = ids
    alert(ids)

    handleData(ids)
  }

  const formattedDate = value.format('MMMM YYYY')

  useEffect(() => {
    setMemberLoader(true)
    getMemberList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const memberOptions = memberList.map((user) => ({
    value: user.name,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {' '}
            {user.name}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))

  const getMemberList = async () => {
    let newAbortController
    const url = `GenerateReport/contractmembers?roletype=all`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const members = response.data.data
        setMemberList(members)
        setMemberLoader(false)
      })
      .catch((error) => {
        //console.error('Error fetching data:', error)
      })
  }

  return (
    <div>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 10px 15px 0px' }}> */}
      <CRow style={{ paddingBottom: '15px' }}>
        <CCol md={8}>
          <LeftOutlined onClick={() => onMonthChange(month - 1)} /> &nbsp;&nbsp;
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{formattedDate}</span>
          &nbsp;&nbsp;
          <RightOutlined onClick={() => onMonthChange(month + 1)} />
        </CCol>
        <CCol md={4}>
          <Select
            style={{ width: '161px' }}
            className="calendar-select"
            id="member-list"
            // value={memberOptions.find((option) => option.value === memberName) || null}
            onChange={handleMember}
            options={
              memberLoader
                ? [
                    {
                      label: (
                        <div style={{ textAlign: 'center' }}>
                          {Array.from({ length: 5 }, (_, index) => (
                            <Skeleton
                              key={index}
                              title={false}
                              avatar={{
                                size: '20',
                              }} // Adjust the width and height here
                              paragraph={{
                                rows: 2,
                                height: '10px',
                                style: { height: '10px !important' },
                              }}
                            />
                          ))}
                        </div>
                      ),
                      value: 'loading',
                      disabled: true,
                    },
                  ]
                : memberOptions
            }
            placeholder="Select Member"
            allowClear
            showSearch
            // style={{ width: '100%',color: 'red' }}
            // style={{ width: '-webkit-fill-available' }}
            suffixIcon={
              <img src={Downarrowimg} alt={Downarrowimg} style={{ width: '10px', height: '7px' }} />
            }
          />
        </CCol>
      </CRow>
      {/* </div> */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'left',
          fontSize: '12px',
          color: '#787a7c',
          paddingBottom: '15px',
          paddingTop: '15px',
          marginLeft: '4px',
        }}
      >
        {fullDayNames.map((day, index) => (
          <div key={index} style={{ width: '14.28%', textAlign: 'left', color: '#919EAB' }}>
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

CustomFullHeaderRender.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any,
  handleData: PropTypes.func,
}
export default CustomFullHeaderRender
