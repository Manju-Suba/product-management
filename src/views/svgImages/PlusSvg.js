import React from 'react'
import PropTypes from 'prop-types'

const PlusSvg = ({ width, height, fill, viewBox }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.8604 7.29834H17.4741V11.041H10.8604V17.6206H7.11768V11.041H0.503906V7.29834H7.11768V0.633301H10.8604V7.29834Z"
      fill={fill}
    />
  </svg>
)

PlusSvg.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  viewBox: PropTypes.string,
}
export default PlusSvg
