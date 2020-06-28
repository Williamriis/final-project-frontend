import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useSelector } from 'react-redux'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  margin-top: 58px;
  height: 100%;
  @media (max-width: 1024px) {
      display: none;
  }
`

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 530px;
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 8px;
`

const Pop = keyframes`
  0% {transform: scale(0.1)};
  100% {transform: scale(1)};
  
`

const MessageBubble = styled.p`
  color: ${props => props.host === props.sender ? 'white' : 'white'};
  background-color: ${props => props.host === props.sender ? "#be913a" : '#427c6d'};
  padding: 10px;
  border-radius: 30px;
  border-bottom-right-radius: ${props => props.user === props.sender ? '3px' : '30px'};
  border-bottom-left-radius: ${props => props.user === props.sender ? '30px' : '3px'};
  max-width: 70%;
  align-self: ${props => props.user === props.sender ? 'flex-end' : 'flex-start'};
  margin: 0;
  margin-top: 3px;
  animation: ${Pop} .3s;
  animation-fill-mode: forwards;
`
const Form = styled.form`
  
  width: 100%;
  box-sizing: border-box;
`

const MessageInput = styled.input`
  width: 80%;
  font-size: 18px;
  background-color: transparent;
  border: 1px solid white;
  color: white;
  
`
const MessageButton = styled.button`
  width: 17%;
  font-size: 18px;
  border: 1px solid white;
  background: transparent;
  color: white;
`

export const Chat = ({ socket, host }) => {
  const [message, setMessage] = useState()
  const chatHistory = useSelector((store) => store.game.messages)
  const user = useSelector((store) => store.game.user.username)
  const handleSubmit = (e) => {
    console.log(message.length)
    e.preventDefault()
    socket.emit('message', { user, message })
    setMessage('')

  }

  return (

    <Container>
      <MessageContainer>
        {chatHistory.map((message) => {
          return <MessageBubble host={host.username} user={user} sender={message.user}>{message.message}</MessageBubble>
        })}
      </MessageContainer>

      <Form onSubmit={(e) => handleSubmit(e)}>
        <MessageInput type="text" maxLength={80} value={message} onChange={(e) => setMessage(e.target.value)}></MessageInput>
        <MessageButton
          type="submit"
          disabled={!message}>Send</MessageButton>
      </Form>
    </Container>
  )
}