'use client'
import React, { useEffect } from 'react'

interface IStopWatch {
    minute: number
    setMinute: (update: (value: number) => number) => void
    seconds: number
    setSeconds: (update: (value: number) => number) => void
    runningStopWatch: boolean
    setRunningStopWatch: (value: boolean) => void
}

const StopWatch: React.FC<IStopWatch> = ({
    minute,
    setMinute,
    seconds,
    setSeconds,
    runningStopWatch,
    setRunningStopWatch,
}) => {
    useEffect(() => {
        if (!runningStopWatch) return
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [runningStopWatch])

    useEffect(() => {
        if (seconds === 60) {
            setMinute(prev => prev + 1)
            setSeconds(prev => 0)
        }
    }, [minute, seconds])

    return (
        <div>
            <p>
                <span>{minute}</span>:<span>{seconds}</span>
            </p>
        </div>
    )
}

export default StopWatch
