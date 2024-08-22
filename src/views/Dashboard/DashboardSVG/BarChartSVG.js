import React from 'react'
import PropTypes from 'prop-types'

const BarChartSVG = ({ width, height, fill, viewBox, stopColor }) => (
  <>
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_7650_14224)">
        <path
          d="M17.25 16.5H3.75C3.15326 16.5 2.58097 16.2629 2.15901 15.841C1.73705 15.419 1.5 14.8467 1.5 14.25V0.75C1.5 0.551088 1.42098 0.360322 1.28033 0.21967C1.13968 0.0790176 0.948912 0 0.75 0C0.551088 0 0.360322 0.0790176 0.21967 0.21967C0.0790176 0.360322 0 0.551088 0 0.75L0 14.25C0.00119089 15.2442 0.396661 16.1973 1.09966 16.9003C1.80267 17.6033 2.7558 17.9988 3.75 18H17.25C17.4489 18 17.6397 17.921 17.7803 17.7803C17.921 17.6397 18 17.4489 18 17.25C18 17.0511 17.921 16.8603 17.7803 16.7197C17.6397 16.579 17.4489 16.5 17.25 16.5Z"
          fill={fill}
        />
        <path
          d="M4.5 15C4.69891 15 4.88968 14.921 5.03033 14.7803C5.17098 14.6397 5.25 14.4489 5.25 14.25V9C5.25 8.80109 5.17098 8.61032 5.03033 8.46967C4.88968 8.32902 4.69891 8.25 4.5 8.25C4.30109 8.25 4.11032 8.32902 3.96967 8.46967C3.82902 8.61032 3.75 8.80109 3.75 9V14.25C3.75 14.4489 3.82902 14.6397 3.96967 14.7803C4.11032 14.921 4.30109 15 4.5 15Z"
          fill={fill}
        />
        <path
          d="M7.5 7.5V14.25C7.5 14.4489 7.57902 14.6397 7.71967 14.7803C7.86032 14.921 8.05109 15 8.25 15C8.44891 15 8.63968 14.921 8.78033 14.7803C8.92098 14.6397 9 14.4489 9 14.25V7.5C9 7.30109 8.92098 7.11032 8.78033 6.96967C8.63968 6.82902 8.44891 6.75 8.25 6.75C8.05109 6.75 7.86032 6.82902 7.71967 6.96967C7.57902 7.11032 7.5 7.30109 7.5 7.5Z"
          fill={fill}
        />
        <path
          d="M11.25 9.75V14.25C11.25 14.4489 11.329 14.6397 11.4697 14.7803C11.6103 14.921 11.8011 15 12 15C12.1989 15 12.3897 14.921 12.5303 14.7803C12.671 14.6397 12.75 14.4489 12.75 14.25V9.75C12.75 9.55109 12.671 9.36032 12.5303 9.21967C12.3897 9.07902 12.1989 9 12 9C11.8011 9 11.6103 9.07902 11.4697 9.21967C11.329 9.36032 11.25 9.55109 11.25 9.75Z"
          fill={fill}
        />
        <path
          d="M15 6.75V14.25C15 14.4489 15.079 14.6397 15.2197 14.7803C15.3603 14.921 15.5511 15 15.75 15C15.9489 15 16.1397 14.921 16.2803 14.7803C16.421 14.6397 16.5 14.4489 16.5 14.25V6.75C16.5 6.55109 16.421 6.36032 16.2803 6.21967C16.1397 6.07902 15.9489 6 15.75 6C15.5511 6 15.3603 6.07902 15.2197 6.21967C15.079 6.36032 15 6.55109 15 6.75Z"
          fill={fill}
        />
        <path
          d="M4.49984 6.75006C4.69874 6.75002 4.88947 6.67097 5.03009 6.53031L7.71959 3.84081C7.86254 3.70463 8.05241 3.62867 8.24984 3.62867C8.44727 3.62867 8.63714 3.70463 8.78009 3.84081L10.4091 5.46981C10.831 5.89162 11.4032 6.12858 11.9998 6.12858C12.5965 6.12858 13.1687 5.89162 13.5906 5.46981L17.7801 1.28031C17.9167 1.13886 17.9923 0.949408 17.9906 0.75276C17.9889 0.556113 17.91 0.368003 17.771 0.228947C17.6319 0.0898912 17.4438 0.0110145 17.2471 0.0093057C17.0505 0.00759688 16.861 0.0831927 16.7196 0.219811L12.5301 4.40856C12.3894 4.54916 12.1987 4.62815 11.9998 4.62815C11.801 4.62815 11.6102 4.54916 11.4696 4.40856L9.84059 2.78031C9.41865 2.3585 8.84646 2.12154 8.24984 2.12154C7.65322 2.12154 7.08103 2.3585 6.65909 2.78031L3.96959 5.46981C3.86473 5.5747 3.79333 5.70832 3.7644 5.85379C3.73548 5.99925 3.75033 6.15003 3.80708 6.28705C3.86383 6.42408 3.95994 6.5412 4.08325 6.62361C4.20655 6.70603 4.35153 6.75003 4.49984 6.75006Z"
          fill={fill}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_7650_14224"
          x1="9"
          y1="0"
          x2="9"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={stopColor} />
          <stop offset="0.34" stopColor={stopColor} />
          <stop offset="1" stopColor={stopColor} />
        </linearGradient>
        <linearGradient
          id="paint1_linear_7650_14224"
          x1="4.5"
          y1="8.25"
          x2="4.5"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={stopColor} />
          <stop offset="0.34" stopColor={stopColor} />
          <stop offset="1" stopColor={stopColor} />
        </linearGradient>
        <linearGradient
          id="paint2_linear_7650_14224"
          x1="8.25"
          y1="6.75"
          x2="8.25"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={stopColor} />
          <stop offset="0.34" stopColor={stopColor} />
          <stop offset="1" stopColor={stopColor} />
        </linearGradient>
        <linearGradient
          id="paint3_linear_7650_14224"
          x1="12"
          y1="9"
          x2="12"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={stopColor} />
          <stop offset="0.34" stopColor={stopColor} />
          <stop offset="1" stopColor={stopColor} />
        </linearGradient>
        <linearGradient
          id="paint4_linear_7650_14224"
          x1="15.75"
          y1="6"
          x2="15.75"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={stopColor} />
          <stop offset="0.34" stopColor={stopColor} />
          <stop offset="1" stopColor={stopColor} />
        </linearGradient>
        <linearGradient
          id="paint5_linear_7650_14224"
          x1="10.8703"
          y1="0.00927734"
          x2="10.8703"
          y2="6.75006"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={stopColor} />
          <stop offset="0.34" stopColor={stopColor} />
          <stop offset="1" stopColor={stopColor} />
        </linearGradient>
        <clipPath id="clip0_7650_14224">
          <rect width="18" height="18" fill={fill} />
        </clipPath>
      </defs>
    </svg>
  </>
)

BarChartSVG.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  viewBox: PropTypes.string.isRequired,
  stopColor: PropTypes.string.isRequired,
}

export default BarChartSVG
