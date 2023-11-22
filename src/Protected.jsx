import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Protected = (props) => {

    const navigate = useNavigate();
    const { Component } = props;

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        console.log(userInfo);
        if (!userInfo) {
            navigate('/auth');
        }
    })

    return (
        <>
            <Component />
        </>
    )
}

export default Protected