import React from 'react'
import Lottie from 'lottie-react-web'
import Animation from '../assets/21192-premium-gold.json'

export const Crown = () => {

    return (
        <Lottie
            options={{
                animationData: Animation,
            }}
            width='150px'
            height='150px'

            autoPlay
        />
    )
}