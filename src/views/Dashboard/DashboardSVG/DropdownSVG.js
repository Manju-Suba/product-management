import React from 'react'
import PropTypes from 'prop-types'

const DropdownSVG = ({ width, height, fill, viewBox, stopColor }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.683144 0.5H8.31686C8.45198 0.500028 8.58405 0.5387 8.69639 0.611128C8.80873 0.683555 8.89629 0.786487 8.948 0.90691C8.9997 1.02733 9.01323 1.15984 8.98688 1.28768C8.96053 1.41552 8.89547 1.53295 8.79994 1.62513L4.98309 5.30702C4.85495 5.43058 4.68118 5.5 4.5 5.5C4.31882 5.5 4.14505 5.43058 4.01691 5.30702L0.200058 1.62513C0.104528 1.53295 0.0394743 1.41552 0.0131215 1.28768C-0.0132313 1.15984 0.000300048 1.02733 0.0520046 0.90691C0.103709 0.786487 0.191266 0.683555 0.303605 0.611128C0.415945 0.5387 0.548023 0.500028 0.683144 0.5Z"
      fill="url(#paint0_linear_12154_20110)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_12154_20110"
        x1="4.5"
        y1="0.5"
        x2="4.5"
        y2="5.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D30000" />
        <stop offset="0.34" stopColor="#D30000" />
        <stop offset="1" stopColor="#D30000" />
      </linearGradient>
    </defs>
  </svg>
)

DropdownSVG.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  viewBox: PropTypes.string.isRequired,
  stopColor: PropTypes.string.isRequired,
}

export default DropdownSVG
