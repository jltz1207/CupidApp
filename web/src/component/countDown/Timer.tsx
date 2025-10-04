import React, { useState, useEffect } from 'react';
import './Timer.css';  // Import the CSS for styling

interface Prop{
    apiSecond?:number
}
const Timer = (p:Prop) => {
    const [seconds, setSeconds] = useState<number>(p.apiSecond??0);
    const [timerActive, setTimerActive] = useState<boolean>(false);

    // Convert total seconds into days, hours, minutes, and seconds
    const getTimeRemaining = (totalSeconds: number) => {
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { days, hours, minutes, seconds };
    };

    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(seconds));

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (timerActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(seconds => {
                    const newTime = seconds - 1;
                    setTimeRemaining(getTimeRemaining(newTime));
                    return newTime;
                });
            }, 1000);
        } else if (seconds === 0 && timerActive) {
            setTimerActive(false);
            alert("Time's up!");
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerActive, seconds]);

    const handleStart = () => {
        setTimerActive(true);
    };

    return (
        <div className="timer-container z-50 absolute-center ">
            <div className="time-display z-40">
                <div className="time-section">{timeRemaining.days}<span>Days</span></div>
                <div className="time-section">{timeRemaining.hours.toString().padStart(2, '0')}<span>Hours</span></div>
                <div className="time-section">{timeRemaining.minutes.toString().padStart(2, '0')}<span>Minutes</span></div>
                <div className="time-section">{timeRemaining.seconds.toString().padStart(2, '0')}<span>Seconds</span></div>
            </div>
        </div>
    );
};

export default Timer;