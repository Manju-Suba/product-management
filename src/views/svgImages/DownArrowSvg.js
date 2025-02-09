import React from 'react'
import PropTypes from 'prop-types'

const DownArrowSvg = ({ width, height, fill, viewBox }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.833156 0H10.1432C10.3079 3.51869e-05 10.469 0.0489282 10.606 0.140498C10.743 0.232069 10.8498 0.362205 10.9129 0.514455C10.9759 0.666705 10.9924 0.834232 10.9603 0.995859C10.9282 1.15749 10.8488 1.30596 10.7323 1.4225L6.07732 6.0775C5.92105 6.23373 5.70913 6.32149 5.48816 6.32149C5.26719 6.32149 5.05526 6.23373 4.89899 6.0775L0.243989 1.4225C0.127481 1.30596 0.0481425 1.15749 0.0160029 0.995859C-0.0161368 0.834232 0.000365935 0.666705 0.0634243 0.514455C0.126483 0.362205 0.233266 0.232069 0.370274 0.140498C0.507282 0.0489282 0.668364 3.51869e-05 0.833156 0Z"
      fill={fill}
    />
  </svg>
)
DownArrowSvg.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  viewBox: PropTypes.string,
}
export default DownArrowSvg
