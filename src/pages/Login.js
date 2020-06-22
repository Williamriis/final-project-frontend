import React, { useState, useRef, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { FormButton, FormText, Input, Form } from '../components/FormComponents'
import { Stars } from '../components/Stars'
import { UserLogin } from '../reducers/game'
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

const Rocket = styled.div`
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
export const Login = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [boxOneLeft, setBoxOneLeft] = useState()
    const [boxOneTop, setBoxOneTop] = useState()
    const [boxTwoLeft, setBoxTwoLeft] = useState()
    const [boxTwoTop, setBoxTwoTop] = useState()
    const [rocketLeft, setRocketLeft] = useState()
    const [rocketTop, setRocketTop] = useState()
    const [rocketGoal, setRocketGoal] = useState()
    const inputOne = useRef()
    const inputTwo = useRef()
    const rocket = useRef()
    const error = useSelector((store) => store.game.errorMessage)
    const userId = useSelector((store) => store.game.user.userId)

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(
            UserLogin(email, password)
        )
    }

    useEffect(() => {
        if (userId) {
            history.push('/game')
        }
    }, [userId, history])

    useEffect(() => {
        setBoxOneLeft(inputOne.current.getBoundingClientRect().left)
        setBoxOneTop(inputOne.current.getBoundingClientRect().top)
        setBoxTwoLeft(inputTwo.current.getBoundingClientRect().left)
        setBoxTwoTop(inputTwo.current.getBoundingClientRect().top)
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
        setRocketGoal(destination)
    }

    const getPos = (field) => {
        switch (field) {
            case 'one':
                return boxOneLeft - 40;

            case 'two':
                return boxTwoLeft - 40;

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
                <Rocket ref={rocket} baseLeft={rocketLeft} baseTop={rocketTop} left={getPos(rocketGoal)}
                    top={getPosTwo(rocketGoal)} startLeft={boxOneLeft} startTop={boxOneTop}
                    onAnimationEnd={() => stationRocket()}>🚀</Rocket>
                <Input ref={inputOne} onFocus={() => getRocket('one')} type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}></Input>
                <Input ref={inputTwo} onFocus={() => getRocket('two')} type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}></Input>
                {error && error.includes('Invalid') && < ErrorMessage text={error} />}
                <FormButton type="submit" disabled={!email || !password}>COME ABOARD</FormButton>
                <FormText>Not a member? <Link to='/' style={{ color: "white" }}>Sign up.</Link></FormText>
            </Form>
        </Container>
    )
}
