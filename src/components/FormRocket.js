import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'


const Fly = (left, top, baseLeft, baseTop) => keyframes`
  0% {top: ${baseTop}px}
  0% {left: ${baseLeft}px}
  20% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
  40% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
  60% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
  100% {left: ${left}px}
  100% {top: ${top}px}
`

const Rocket = styled.span`
 position: absolute;
 font-size: 30px;
 z-index: -5;
left: ${props => props.startLeft - 40}px;
top: ${props => props.startTop + 5}px;
 animation: ${props => Fly(props.left, props.top, props.baseLeft, props.baseTop)} 1s;
 animation-fill-mode: forwards;
 @media (max-width: 680px) {
     display: none;
 }
`

export const FormRocket = ({ inputOne, inputTwo, inputThree, rocketGoal }) => {
    const [boxOneLeft, setBoxOneLeft] = useState()
    const [boxOneTop, setBoxOneTop] = useState()
    const [boxTwoLeft, setBoxTwoLeft] = useState()
    const [boxTwoTop, setBoxTwoTop] = useState()
    const [boxThreeLeft, setBoxThreeLeft] = useState()
    const [boxThreeTop, setBoxThreeTop] = useState()
    const [rocketLeft, setRocketLeft] = useState()
    const [rocketTop, setRocketTop] = useState()

    const rocket = useRef()


    //sets initial values

    useEffect(() => {
        setBoxOneLeft(inputOne.current.getBoundingClientRect().left)
        setBoxOneTop(inputOne.current.getBoundingClientRect().top)
        setBoxTwoLeft(inputTwo.current.getBoundingClientRect().left)
        setBoxTwoTop(inputTwo.current.getBoundingClientRect().top)
        setRocketLeft(rocket.current.getBoundingClientRect().left)
        setRocketTop(rocket.current.getBoundingClientRect().top)
        if (inputThree) {
            setBoxThreeLeft(inputThree.current.getBoundingClientRect().left)
            setBoxThreeTop(inputThree.current.getBoundingClientRect().top)
        }
    }, [rocket])


    //defines X axis goal of rocket animation
    const getPosX = (field) => {
        switch (field) {
            case 'one':
                return boxOneLeft - 40;

            case 'two':
                return boxTwoLeft + inputTwo.current.getBoundingClientRect().width + 10;

            case 'three':
                return boxThreeLeft - 40;

            default:
                return ''
        }
    }

    //defines Y axis goal of rocket animation
    const getPosY = (field) => {
        switch (field) {
            case 'one':
                return boxOneTop + 5;

            case 'two':
                return boxTwoTop + 5;

            case 'three':
                return boxThreeTop + 5;

            default:
                return ''
        }
    }

    //updates position on page of inputs and rocket itself after every rocket animaton and if page resizes

    const stationRocket = () => {
        setRocketTop(rocket.current.getBoundingClientRect().top)
        setRocketLeft(rocket.current.getBoundingClientRect().left)
        setBoxOneLeft(inputOne.current.getBoundingClientRect().left)
        setBoxOneTop(inputOne.current.getBoundingClientRect().top)
        setBoxTwoLeft(inputTwo.current.getBoundingClientRect().left)
        setBoxTwoTop(inputTwo.current.getBoundingClientRect().top)
        if (inputThree) {
            setBoxThreeLeft(inputThree.current.getBoundingClientRect().left)
            setBoxThreeTop(inputThree.current.getBoundingClientRect().top)
        }

    }
    window.onresize = () => stationRocket()
    return (
        <Rocket
            role="img"
            aria-label="rocket"
            ref={rocket}
            baseLeft={rocketLeft}
            baseTop={rocketTop}
            left={getPosX(rocketGoal)}
            top={getPosY(rocketGoal)}
            startLeft={boxOneLeft}
            startTop={boxOneTop}
            onAnimationEnd={() => stationRocket()}>🚀</Rocket>
    )
}