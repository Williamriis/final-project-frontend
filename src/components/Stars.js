import React from 'react'
import './stars.css'

export const Stars = ({ left, top }) => {

    return (
        <div style={{ left: left, top: top }} className="container">
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
        </div>
    )
}