import React, { useState, useEffect } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function useSessionTimeout() {
  const navigate = useNavigate()
  const timeout = 1000 * 60 * 60 // 30 minutes
  // const timeout = 3000;
  const [remaining, setRemaining] = useState(timeout)
  const [isModalShown, setIsModalShown] = useState(false)

  const handleOnIdle = () => {
    if (!isModalShown) {
      // SHOW YOUR MODAL HERE AND LOGOUT
      Swal.fire({
        title: 'Session is timeout',
        text: 'Please login again',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear()
          navigate('/')
        }
      })
      // Set isModalShown to true to prevent showing the modal multiple times
      setIsModalShown(true)
    }
  }

  const { getRemainingTime } = useIdleTimer({
    timeout,
    onIdle: handleOnIdle,
  })

  useEffect(() => {
    setRemaining(getRemainingTime())

    const intervalId = setInterval(() => {
      setRemaining(getRemainingTime())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return <></>
}
