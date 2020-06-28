/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory, Link } from 'react-router-dom'
import { UserSignUp } from '../reducers/game'
import { Logo } from '../components/Logo'
import { FormButton, FormText, Input, Form } from '../components/FormComponents'
import { Stars } from '../components/Stars'
import { FormErrorMessage } from '../components/FormErrorMessage'
import { FormRocket } from '../components/FormRocket'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const Signup = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const userId = useSelector((store) => store.game.user.userId)
    const error = useSelector((store) => store.game.errorMessage)
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [rocketGoal, setRocketGoal] = useState()
    const inputOne = useRef()
    const inputTwo = useRef()
    const inputThree = useRef()


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


    return (
        <Container>
            <Stars />
            <Logo text="COME ABOARD" />
            <Form onSubmit={(e) => handleSubmit(e)}>
                <Input
                    ref={inputOne}
                    onFocus={() => setRocketGoal('one')}
                    type="text" placeholder="Username"
                    required
                    minLength={3}
                    maxLength={20}
                    onChange={(e) => setUsername(e.target.value)}>

                </Input>

                {error && error.includes('Username') && <FormErrorMessage text={error} />}

                <Input
                    ref={inputTwo}
                    onFocus={() => setRocketGoal('two')}
                    type="email" placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}>

                </Input>

                {error && error.includes('Email') && <FormErrorMessage text={error} />}

                <Input
                    ref={inputThree}
                    onFocus={() => setRocketGoal('three')}
                    type="password"
                    placeholder="Password"
                    required
                    minLength={8}
                    onChange={(e) => setPassword(e.target.value)}>

                </Input>
                <FormButton disabled={!username || !email || !password} type="submit">COME ABOARD</FormButton>
                <FormText>Already a member? <Link to='/login' style={{ color: "white" }}>Log in.</Link></FormText>
                <FormRocket rocketGoal={rocketGoal} inputOne={inputOne} inputTwo={inputTwo} inputThree={inputThree} />
            </Form>
        </Container >
    )
}