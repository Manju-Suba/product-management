import React from 'react'
import PropTypes from 'prop-types'

const CheckSvg = ({ width, height, fill, viewBox }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.87459 9.58157C5.2816 9.58171 5.67193 9.41992 5.95949 9.13188L12.9552 2.13716L12.9553 2.13712C13.3482 1.74402 13.3482 1.10682 12.9553 0.713727L12.9552 0.713671C12.5621 0.320704 11.9249 0.320704 11.5318 0.713671L11.5318 0.713699L4.87459 7.37091L2.4682 4.96451L2.46817 4.96448C2.07508 4.57151 1.43788 4.57151 1.04478 4.96448L1.04473 4.96454C0.651758 5.35763 0.651758 5.99483 1.04473 6.38793L1.04479 6.38799L3.7897 9.13188C3.78971 9.1319 3.78972 9.13191 3.78973 9.13192C4.07729 9.41994 4.46761 9.58171 4.87459 9.58157ZM4.87459 9.58157C4.87456 9.58157 4.87453 9.58157 4.87449 9.58157L4.87459 9.33157L4.8747 9.58157C4.87466 9.58157 4.87463 9.58157 4.87459 9.58157Z"
      fill={fill}
      stroke="#A5A1A1"
      strokeWidth="0.5"
    />
  </svg>
)
CheckSvg.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  viewBox: PropTypes.string,
}
export default CheckSvg
