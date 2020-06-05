import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { UserSignUp } from '../reducers/game'

export const Signup = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(
            UserSignUp(username, email, password)
        )
        history.push('/game')
    }
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}></input>
            <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}></input>
            <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}></input>
            <button type="submit">Sign up</button>
        </form>
    )
}