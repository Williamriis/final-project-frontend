import React from 'react'
import Lottie from 'lottie-react-web'
import Astronaut from '../assets/16732-super-hero-charging.json'

export const Spaceman = () => {

    return (
        <Lottie
            options={{
                animationData: Astronaut,
            }}
            width='200px'
            height='200px'
            autoPlay
        />
    )
}