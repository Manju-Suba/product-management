import React from 'react'
import PropTypes from 'prop-types'

const Circle = ({ width, height, fill, viewBox, color }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5.3457" cy="4.5" r="4.5" fill={color} />
  </svg>
)
Circle.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  viewBox: PropTypes.string,
  color: PropTypes.string,
}
export default Circle
