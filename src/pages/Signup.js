import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import { useHistory, Link } from 'react-router-dom'
import { UserSignUp } from '../reducers/game'
import { Logo } from '../components/Logo'
import { FormButton, FormText, Input, Form } from '../components/FormComponents'
import { Stars } from '../components/Stars'
import { ErrorMessage } from '../components/ErrorMessage'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`


const Fly = (left, top, baseLeft, baseTop) => keyframes`
  0% {top: ${baseTop}px}
  0% {left: ${baseLeft}px}
  20% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
  40% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
  60% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
//   80% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
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
export const Signup = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const userId = useSelector((store) => store.game.user.userId)
    const error = useSelector((store) => store.game.errorMessage)
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [boxOneLeft, setBoxOneLeft] = useState()
    const [boxOneTop, setBoxOneTop] = useState()
    const [boxTwoLeft, setBoxTwoLeft] = useState()
    const [boxTwoTop, setBoxTwoTop] = useState()
    const [boxThreeLeft, setBoxThreeLeft] = useState()
    const [boxThreeTop, setBoxThreeTop] = useState()
    const [rocketLeft, setRocketLeft] = useState()
    const [rocketTop, setRocketTop] = useState()
    const [rocketGoal, setRocketGoal] = useState()
    const inputOne = useRef()
    const inputTwo = useRef()
    const inputThree = useRef()
    const rocket = useRef()

    useEffect(() => {
        if (userId) {
            history.push('/game')
        }
    }, [userId, history])

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(
            UserSignUp(username, email, password)
        )
    }

    useEffect(() => {
        setBoxOneLeft(inputOne.current.getBoundingClientRect().left)
        setBoxOneTop(inputOne.current.getBoundingClientRect().top)
        setBoxTwoLeft(inputTwo.current.getBoundingClientRect().left)
        setBoxTwoTop(inputTwo.current.getBoundingClientRect().top)
        setBoxThreeLeft(inputThree.current.getBoundingClientRect().left)
        setBoxThreeTop(inputThree.current.getBoundingClientRect().top)
        setRocketLeft(rocket.current.getBoundingClientRect().left)
        setRocketTop(rocket.current.getBoundingClientRect().top)
    }, [rocket])

    const getRocket = (destination) => {
        setRocketTop(rocket.current.getBoundingClientRect().top)
        setRocketLeft(rocket.current.getBoundingClientRect().left)
        setBoxOneLeft(inputOne.current.getBoundingClientRect().left)
        setBoxOneTop(inputOne.current.getBoundingClientRect().top)
        setBoxTwoLeft(inputTwo.current.getBoundingClientRect().left)
        setBoxTwoTop(inputTwo.current.getBoundingClientRect().top)
        setBoxThreeLeft(inputThree.current.getBoundingClientRect().left)
        setBoxThreeTop(inputThree.current.getBoundingClientRect().top)
        setRocketGoal(destination)
    }

    const getPos = (field) => {
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
    const getPosTwo = (field) => {
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

    const stationRocket = () => {
        setRocketTop(rocket.current.getBoundingClientRect().top)
        setRocketLeft(rocket.current.getBoundingClientRect().left)
    }

    return (
        <Container>
            <Stars />
            <Logo text="COME ABOARD" />
            <Form onSubmit={(e) => handleSubmit(e)}>
                <Input ref={inputOne} onFocus={() => getRocket('one')} type="text" placeholder="Username" required minLength={3} maxLength={20} onChange={(e) => setUsername(e.target.value)}></Input>
                {error && error.includes('Username') && <ErrorMessage text={error} />}
                <Input ref={inputTwo} onFocus={() => getRocket('two')} type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}></Input>
                {error && error.includes('Email') && <ErrorMessage text={error} />}
                <Input ref={inputThree} onFocus={() => getRocket('three')} type="password" placeholder="Password" required minLength={8} onChange={(e) => setPassword(e.target.value)}></Input>
                <FormButton disabled={!username || !email || !password} type="submit">COME ABOARD</FormButton>
                <FormText>Already a member? <Link to='/login' style={{ color: "white" }}>Log in.</Link></FormText>
                <Rocket role="img" ref={rocket} baseLeft={rocketLeft} baseTop={rocketTop} left={getPos(rocketGoal)}
                    top={getPosTwo(rocketGoal)} startLeft={boxOneLeft} startTop={boxOneTop}
                    onAnimationEnd={() => stationRocket()}>🚀</Rocket>
            </Form>
        </Container >
    )
}