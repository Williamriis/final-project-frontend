import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { FormButton, FormText, Input, Form } from '../components/FormComponents'
import { Stars } from '../components/Stars'
import { UserLogin } from '../reducers/game'
import { FormErrorMessage } from '../components/FormErrorMessage'
import { FormRocket } from '../components/FormRocket'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const Login = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [rocketGoal, setRocketGoal] = useState()
    const inputOne = useRef()
    const inputTwo = useRef()
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

    return (
        <Container>
            <Stars />
            <Logo text="COME ABOARD" />
            <Form onSubmit={(e) => handleSubmit(e)}>
                <FormRocket rocketGoal={rocketGoal} inputOne={inputOne} inputTwo={inputTwo} />
                <Input
                    ref={inputOne}
                    onFocus={() => setRocketGoal('one')}
                    type="email" placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}>

                </Input>
                <Input
                    ref={inputTwo}
                    onFocus={() => setRocketGoal('two')}
                    type="password" placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}>

                </Input>
                {error && error.includes('Invalid') && < FormErrorMessage text={error} />}
                <FormButton type="submit" disabled={!email || !password}>COME ABOARD</FormButton>
                <FormText>Not a member? <Link to='/' style={{ color: "white" }}>Sign up.</Link></FormText>
            </Form>
        </Container>
    )
}
