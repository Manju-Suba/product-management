import React, { useState, useRef, useEffect } from 'react'
import { DatePicker, Breadcrumb, Select as AntdSelect } from 'antd'
import { CCol, CRow, CSpinner } from '@coreui/react'
import { ImageUrl, getDecodeData, getHeaders } from 'src/constant/Global'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import useAxios from 'src/constant/UseAxios'
import dayjs from 'dayjs'
import Downarrowimg from '../../assets/images/downarrow.png'
import Calendarimg from '../../assets/images/calendar-image.png'
import Chart from 'react-apexcharts'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import {
  Select as MuiSelect,
  MenuItem,
  Checkbox,
  ListItemText,
  ListItemIcon,
  Input,
  InputAdornment,
  Autocomplete,
  TextField,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
const processData = (item, member) => {
  if (item.attendance !== null && item.attendance !== 'leave') {
    const attendance = item.attendance
    const baseObject = {
      x: item.name,
      fillColor: '',
      name: attendance.username,
      date: dayjs(attendance.date).format('DD-MM-YYYY'),
      employeeID: attendance.employeeID,
      signIn: attendance.signIn,
      signOut: attendance.signOut,
      totalWorkHours: attendance.totalWorkHours,
      actualWorkHours: attendance.acutalWorkHours,
      shortfallHours: attendance.shortfallHours,
      excessHours: attendance.excessHours,
      timesheetEnteredHours: attendance.timesheetHours,
    }

    if (attendance.shortfallHours !== '00:00') {
      baseObject.y = attendance.acutalWorkHours
      baseObject.fillColor = '#ff4c4c'
      if (member.length === 0) {
        baseObject.fillColor = '#ff4c4c'
      } else if (member.includes(attendance.employeeID)) {
        baseObject.fillColor = '#ff4c4c'
      } else {
        baseObject.fillColor = '#ffc3c3'
      }
    } else if (attendance.regularizationStatus === true) {
      baseObject.y = attendance.acutalWorkHours
      baseObject.fillColor = '#FFA657'
      if (member.length === 0) {
        baseObject.fillColor = '#FFA657'
      } else if (member.includes(attendance.employeeID)) {
        baseObject.fillColor = '#FFA657'
      } else {
        baseObject.fillColor = '#ffd2aa'
      }
    } else {
      baseObject.y = attendance.acutalWorkHours
      baseObject.fillColor = '#357AF6'
      if (member.length === 0) {
        baseObject.fillColor = '#357AF6'
      } else if (member.includes(attendance.employeeID)) {
        baseObject.fillColor = '#357AF6'
      } else {
        baseObject.fillColor = '#c8daff'
      }
    }

    return baseObject
  } else if (item.attendance === 'leave') {
    return {
      x: item.date,
      y: 12,
      columnWidth: '60%',
      fillColor:
        member.length === 0 ? '#FF7D90' : member.includes(item.employeeID) ? '#FF7D90' : '#ffc2cb',
    }
  } else {
    return {
      x: item.name,
      y: 12,
      fillColor: member.length === 0 ? '#e1e1e1' : '#e1e1e1',
    }
  }
}

const tagRender = (props) => {
  const { label } = props
  return <span>{label}</span>
}

tagRender.propTypes = {
  label: PropTypes.any.isRequired,
}
const SwipeDetails = ({ formatDate, memberLists, memberLoader }) => {
  let api = useAxios()
  const user = getDecodeData()
  const jod = user?.jod
  const [memberList, setMemberList] = useState(memberLists)
  const dateRef = useRef(dayjs().format('YYYY-MM-DD'))
  const [data, setData] = useState([])
  const [member, setMember] = useState([])
  const [chartSeries, setChartSeries] = useState([])
  const [loader, setLoader] = useState(true)
  const shortfall = useRef(false)
  const excess = useRef(false)
  const page = useRef(0)
  const size = useRef(10)
  const hasMore = useRef(true)
  const [searchQuery, setSearchQuery] = useState('')
  useEffect(() => {
    if (memberLists !== undefined) {
      setMemberList(memberLists)
    }
  }, [memberLists])

  useEffect(() => {
    getSwipeDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSwipeDetails = async () => {
    const url = `fetchDataList?date=${dateRef.current}&checkShortfallHours=${shortfall.current}&excessHours=${excess.current}&size=${size.current}&page=${page.current}`
    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
      })
      const data = response.data.data
      setData(data.data)

      if (data.data.length < size.current) {
        hasMore.current = false
      } else if (page.current === data.totalPages - 1) {
        hasMore.current = false
      }
    } catch (error) {}
  }

  const handleDateChange = (date, dateString) => {
    if (date !== null) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      dateRef.current = formattedDate
      page.current = 0
      hasMore.current = true
      setLoader(true)
      setData([])
      getSwipeDetails()
    }
  }

  const memberOption = (memberList || []).map((user) => ({
    value: user.userName,
    label: user.name,
    icon: user.profile_pic,
  }))

  const [options, setOptions] = useState({
    chart: {
      type: '',
      height: 350,
      width: 300,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        barGap: '50%',
        endingShape: 'rounded',
        borderRadius: 7,
        borderRadiusWhenStacked: 'last',
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top',
        },
        rangeBarOverlap: true,
        width: '20%',
      },
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        shape: 'circle',
        radius: 6,
        width: '9px',
        height: '9px',
      },
      customLegendItems: [
        'Shortfall',
        'Leave',
        'Actual Work Hours',
        'TimeSheet Entered',
        'Regularization',
      ],
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
    colors: ['#ff4c4c', '#FF7D90', '#357AF6', '#5CC8BE', '#FFA657'],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [],
      style: {
        width: '50px',
        color: '#5C5C5C',
        fontWeight: 600,
        fontSize: '13px',
      },
      title: {
        text: 'Team Members',
        style: {
          color: '#6D6D6D',
          fontWeight: 600,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 12,
      title: {
        text: 'Hours',
        style: {
          color: '#6D6D6D',
          fontWeight: 'bold',
          fontSize: '12px',
        },
      },
    },
    fill: {
      colors: ['#4CAF50', '#FFC107', '#F44336'], // Example colors
    },
    tooltip: {
      style: {
        background: 'none',
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
        if (
          !data ||
          data.signIn === undefined ||
          data.signOut === undefined ||
          data.shortfallHours === undefined ||
          data.excessHours === undefined
        ) {
          return ''
        } else {
          return `<div style="width: 275px;">
          <div style="font-weight: bold; color: #505050; box-shadow: 0px 4.41px 48.5px 0px #0000001A; padding: 10px;height:45px;background:#FFFFFF">${data.name} <span style="font-size:11px;color:#A7A7A7;margin-left:5px">${data.date}</span></div><br/>
          <div style="padding-left:15px">
          <div class="row">
          <div class="col-sm-6">
          <span style="font-size:11px;color:#505050;">Swipe in</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;color:#909090;padding-left:5px;padding-top:5px;">${data.signIn}</span></div></br>
          </div>
          <div class="col-sm-6"><span style="font-size:11px;color:#505050;">Swipe out</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.signOut}</span></div></br>
          </div>
          </div>
          <div class="row">
          <div class="col-sm-6">
          <span style="font-size:11px;color:#505050;">Total Work Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.totalWorkHours}</span></div></br>
          </div>
          <div class="col-sm-6"><span style="font-size:11px;color:#505050;">Actual Work Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.actualWorkHours}</span></div></br>
          </div>
          </div>
          <div class="row">
          <div class="col-sm-6">
          <span style="font-size:11px;color:#505050;">Shortfall Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.shortfallHours}</span></div></br>
          </div>
          <div class="col-sm-6"><span style="font-size:11px;color:#505050;">Excess Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.excessHours}</span></div></br>
          </div>
          </div>
          <div class="row">
          <div class="col-sm-6">
          <span style="font-size:11px;color:#505050;">Timesheet Entered Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.timesheetEnteredHours}</span></div></br>
          </div>
          </div>
          </div>
          </div>`
        }
      },
    },
  })
  const getName = (value, maxLength = 16) => {
    const modifiedTitle = value
    return modifiedTitle.length > maxLength
      ? `${modifiedTitle.substring(0, maxLength)}...`
      : modifiedTitle
  }
  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: data?.map((c) => getName(c.name)),
        labels: {
          style: {
            colors: [], // Optionally customize the color of the labels
            fontSize: '12px', // Customize the font size
          },
        },
      },
      plotOptions: {
        bar: {
          ...prevOptions.plotOptions.bar,
          columnWidth: data?.length === 1 ? '10%' : data?.length < 5 ? '40%' : '45%',
          barGap: '10%', // Adjust the gap between bars
          horizontal: false,
          endingShape: 'rounded',
          borderRadius: 7,
          borderRadiusWhenStacked: 'last',
          borderRadiusApplication: 'end',
          dataLabels: {
            position: 'top',
          },
        },
      },
    }))

    setChartSeries([
      {
        name: 'Shortfall/Actual Work Hours',
        data: data?.map((item) => processData(item, member)),
      },
      {
        name: 'Timesheet Entered',
        data: data?.map((item) => {
          if (item.attendance !== null) {
            const attendance = item.attendance
            return {
              x: item.name,
              y: attendance?.timesheetHours === '00:00 Hrs' ? null : attendance?.timesheetHours,
              fillColor:
                member.length === 0
                  ? '#5CC8BE'
                  : member.includes(attendance?.employeeID)
                  ? '#5CC8BE'
                  : '#c9f5f1cc',
              name: attendance?.username,
              date: dayjs(attendance?.date).format('DD-MM-YYYY'),
              employeeID: attendance?.employeeID,
              signIn: attendance?.signIn,
              signOut: attendance?.signOut,
              totalWorkHours: attendance?.totalWorkHours,
              actualWorkHours: attendance?.acutalWorkHours,
              shortfallHours: attendance?.shortfallHours,
              excessHours: attendance?.excessHours,
              timesheetEnteredHours: attendance?.timesheetHours,
            }
          } else {
            return {
              x: item.name,
              y: null,
            }
          }
        }),
      },
    ])
    setLoader(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, member])
  const getDefaultValues = (options) => {
    return memberOption.filter((option) => option.selected).map((option) => option.value)
  }

  const defaultValues = getDefaultValues(memberOption)

  const [selectedValues, setSelectedValues] = useState(defaultValues)

  // const handleChange = (event) => {
  //   setLoader(true)
  //   const {
  //     target: { value },
  //   } = event
  //   setMember(value)
  //   setSelectedValues(typeof value === 'string' ? value.split(',') : value)
  // }

  const scrollRight = () => {
    page.current = page.current + 1
    hasMore.current = true
    setLoader(true)
    getSwipeDetails()
  }

  const scrollLeft = () => {
    page.current = page.current - 1
    hasMore.current = true
    setLoader(true)
    getSwipeDetails()
  }

  const handleSearchChange = (event) => {
    event.stopPropagation()
    setSearchQuery(event.target.value)
  }

  const filteredOptions = memberOption.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const [selectedOptions, setSelectedOptions] = useState([])

  const handleChange = (event, value) => {
    const values = value.map((opt) => opt.value)
    setSelectedOptions(values)
  }

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
  const checkedIcon = <CheckBoxIcon fontSize="small" />

  return (
    <>
      <MuiSelect
        multiple
        className="multiselect_container"
        value={selectedValues}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <span style={{ color: '#C9CACB', fontSize: '14px', fontWeight: '500' }}>
                Choose Members
              </span>
            )
          } else {
            return selected
              .map((value) => memberOption.find((option) => option.value === value)?.label || '')
              .join(', ')
          }
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 224,
              width: 250,
            },
          },
        }}
        style={{
          borderBottom: '1px solid #ced4da',
          width: '80%',
          height: '33px',
          borderRadius: '0px',
          marginLeft: '36px',
        }}
      >
        <MenuItem>
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Members"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            fullWidth
            onMouseDown={(event) => {
              event.stopPropagation()
            }}
          />
        </MenuItem>
        {filteredOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="list_color"
          >
            <Checkbox className="check_color" checked={selectedValues.includes(option.value)} />
            <ListItemIcon>
              <img
                src={option.icon ? ImageUrl + option.icon : profileImage1}
                style={option.icon ? { width: '29px' } : { width: '39px' }}
                alt={option.name}
                className="img-flag"
              />
            </ListItemIcon>
            <ListItemText className="text_list" primary={option.label} />
          </MenuItem>
        ))}
      </MuiSelect>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={memberOption}
        disableCloseOnSelect
        limitTags="2"
        disableClearable
        getOptionLabel={(option) => option.label}
        renderOption={(props, option, { selected }) => {
          // eslint-disable-next-line react/prop-types
          const { key, ...optionProps } = props
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <img
                src={option.icon ? ImageUrl + option.icon : profileImage1}
                style={option.icon ? { width: '29px' } : { width: '39px' }}
                alt={option.name}
                className="img-flag"
              />
              <ListItemText className="text_list mx-2" primary={option.label} />
            </li>
          )
        }}
        style={{ width: 380 }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={`${selectedOptions.length !== 0 ? '' : 'Choose members'}`}
            variant="standard"
          />
        )}
      />
    </>
  )
}

SwipeDetails.propTypes = {
  formatDate: PropTypes.func,
  memberLists: PropTypes.array,
  memberLoader: PropTypes.bool,
}

export default SwipeDetails
