import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './NotFound.css';
import backgroundImage from "../../../src/assets/NotFound.png";

const NotFound = () => {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => {
                setSeconds(seconds - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            navigate('/');
        }
    }, [navigate, seconds]);

    return (
        <div className="not-found" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="centerer">
                <a onClick={() => navigate('/')} className="backtohome">Back to homepage  {seconds}</a>
            </div>
        </div>


    );
};

export default NotFound;
