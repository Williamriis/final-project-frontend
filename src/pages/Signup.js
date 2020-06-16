import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import { useHistory } from 'react-router-dom'
import { UserSignUp } from '../reducers/game'
import { faRocket } from '@fortawesome/free-solid-svg-icons'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

`
const Header = styled.p`
  font-family: 'Russo One';
  color: white;
  font-size: 60px;
  margin: 0;
  text-shadow: black 2px 2px;
  filter: drop-shadow(0 0 6px #699bff);
`

const SubHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  align-items: center;
  width: 100%;
  justify-content: center;
  margin-top: -10px;
`

const LineContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 37%;
  align-items: ${props => props.align};
`
const Line = styled.div`
  height: 5px;
  width: ${props => props.width};
  background-color: white;
  margin-top: 5px;
  box-shadow: black 1px 1px 1px 1px;
  
`

const SubHeader = styled.p`
  font-size: 30px;
  font-family: 'Russo One';
  color: white;
  margin: 0;
  text-shadow: black 2px 2px;
  padding: 0 15px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`

const Input = styled.input`
  padding: 10px;
  font-size: 20px;
  border-radius: 8px;
  border: none;
  background: white;
  opacity: .7;
`
const Fly = (left, top, baseLeft, baseTop) => keyframes`
${console.log(left)}
  0% {top: ${baseTop}px}
  0% {left: ${baseLeft}px}
  20% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
  40% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
  60% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
  80% {transform: rotate(${Math.ceil(Math.random() * 359)}deg)}
  100% {left: ${left}px}
  100% {top: ${top}px}
`
const Bob = keyframes`
  0% { top: 0}
  50% {top: -5px}
  100% {top: 0}
`
const Rocket = styled.div`
 position: absolute;
 font-size: 30px;
 z-index: -5;
left: ${props => props.startLeft - 40}px;
top: ${props => props.startTop + 5}px;
 animation: ${props => Fly(props.left, props.top, props.baseLeft, props.baseTop)} 2s;
 animation-fill-mode: forwards;
`
export const Signup = () => {
    const history = useHistory()
    const dispatch = useDispatch()
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
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(
            UserSignUp(username, email, password)
        )
        history.push('/game')
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
        setRocketTop(rocket.current.getBoundingClientRect().top)
        setRocketLeft(rocket.current.getBoundingClientRect().left)
    }

    const getPos = (field) => {
        switch (field) {
            case 'one':
                return boxOneLeft - 40;
                break;
            case 'two':
                return boxTwoLeft + inputTwo.current.getBoundingClientRect().width + 10;
                break;
            case 'three':
                return boxThreeLeft - 40;
                break;
            default:
                return ''
        }
    }
    const getPosTwo = (field) => {
        switch (field) {
            case 'one':
                return boxOneTop + 5;
                break;
            case 'two':
                return boxTwoTop + 5;
                break;
            case 'three':
                return boxThreeTop + 5;
                break;
            default:
                return ''
        }
    }
    return (
        <Container>
            <Header>CHESS ACADEMY</Header>
            <SubHeaderContainer>
                <LineContainer align={"flex-end"}>
                    <Line width={"110%"}></Line>
                    <Line width={"120%"}></Line>
                </LineContainer>
                <SubHeader >SIGNUP</SubHeader>
                <LineContainer aling={"flex-start"}>
                    <Line width={"110%"}></Line>
                    <Line width={"120%"}></Line>
                </LineContainer>
            </SubHeaderContainer>
            <Form onSubmit={(e) => handleSubmit(e)}>

                <Input ref={inputOne} onClick={() => getRocket('one')} type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}></Input>
                <Input ref={inputTwo} onClick={() => getRocket('two')} type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}></Input>
                <Input ref={inputThree} onClick={() => getRocket('three')} type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}></Input>
                <button type="button" onClick={() => console.log(inputOne.current.getBoundingClientRect())}>Sign up</button>
                <Rocket ref={rocket} baseLeft={rocketLeft} baseTop={rocketTop} left={getPos(rocketGoal)}
                    top={getPosTwo(rocketGoal)} startLeft={boxOneLeft} startTop={boxOneTop}>🚀</Rocket>
            </Form>
        </Container >
    )
}