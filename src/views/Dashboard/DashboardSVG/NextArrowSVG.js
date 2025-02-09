import React from 'react'
import PropTypes from 'prop-types'

const NextArrowSVG = ({ width, height, fill, viewBox, stopColor }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill={stopColor}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.33325 4.33333C0.965062 4.33333 0.666585 4.63181 0.666585 5C0.666585 5.36819 0.965062 5.66667 1.33325 5.66667V4.33333ZM15.138 5.4714C15.3983 5.21105 15.3983 4.78895 15.138 4.5286L10.8953 0.285954C10.635 0.0256052 10.2129 0.0256052 9.95254 0.285954C9.69219 0.546304 9.69219 0.968414 9.95254 1.22876L13.7238 5L9.95254 8.77124C9.69219 9.03159 9.69219 9.4537 9.95254 9.71405C10.2129 9.97439 10.635 9.97439 10.8953 9.71405L15.138 5.4714ZM1.33325 5.66667H14.6666V4.33333H1.33325V5.66667Z"
      fill={fill}
    />
  </svg>
)

NextArrowSVG.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  viewBox: PropTypes.string.isRequired,
  stopColor: PropTypes.string.isRequired,
}

export default NextArrowSVG
