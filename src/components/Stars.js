import React from 'react'
import './stars.css'




export const Stars = ({ left, top }) => {

    return (
        <div style={{ left: left, top: top }} class="container">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>

        </div>
    )
}