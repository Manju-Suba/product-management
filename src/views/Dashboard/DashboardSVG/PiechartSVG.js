import React from 'react'
import PropTypes from 'prop-types'

const PieChartIcon = ({ width, height, fill, viewBox, stopColor }) => (
  <>
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.48887 2.82247L9.48805 2.75923C9.48319 2.3851 9.17851 2.08435 8.80434 2.08435H8.74116C8.6896 2.08386 8.63803 2.08386 8.58647 2.08435C4.11463 2.12706 0.524075 5.78685 0.566783 10.2587C0.609492 14.7306 4.26928 18.3211 8.74112 18.2784C13.2109 18.2735 16.8332 14.6515 16.8385 10.1817V10.1274C16.8385 9.74975 16.5324 9.44362 16.1548 9.44362H10.164C9.78602 9.44362 9.47973 9.13689 9.48028 8.75887L9.48887 2.82247Z"
        fill={fill}
      />
      <path
        d="M11.6589 0.648021C11.2818 0.611467 10.9727 0.921413 10.9727 1.30032V7.28803C10.9727 7.66566 11.2788 7.97179 11.6564 7.97179H17.6435C18.0223 7.97179 18.3323 7.66272 18.2958 7.2856C17.9562 3.77789 15.1666 0.987999 11.6589 0.648021Z"
        fill={fill}
      />
      <defs>
        <linearGradient
          id="paint0_linear_11354_26630"
          x1="8.70246"
          y1="2.08398"
          x2="8.70246"
          y2="18.2788"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF2D2D" />
          <stop offset="0.34" stopColor="#F91414" />
          <stop offset="1" stopColor="#D30000" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_11354_26630"
          x1="14.6515"
          y1="0.613281"
          x2="14.6515"
          y2="7.97179"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF2D2D" />
          <stop offset="0.34" stopColor={stopColor} />
          <stop offset="1" stopColor={stopColor} />
        </linearGradient>
      </defs>
    </svg>
  </>
)

PieChartIcon.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  viewBox: PropTypes.string.isRequired,
  stopColor: PropTypes.string.isRequired,
}

export default PieChartIcon
