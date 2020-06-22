import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { game } from '../reducers/game'
import { Logo } from '../components/Logo'
import { Stars } from '../components/Stars'

const Bob = keyframes`
  0% {transform: scale(1)}
  50% {transform: scale(.95)}
  100% {transform: scale(1)}
`
const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  height: 60vh;
  @media (max-width: 680px) {
    height: 80vh;
  }
`

const ContentContainer = styled.div`
  width: 120%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 680px) {
    flex-direction: column;
    width: 80%;
    margin-top: 20px;
  }
`

const NavButton = styled.button`
  font-family: 'Russo One';
  font-size: 18px;
  color: white;
  padding: 10px;
  background-color: #262626;
  opacity: .7;
  box-shadow: black 3px 3px 8px 3px;
  border-radius: 8px;
  border: none;
  animation: ${Bob} 5s ease-in-out infinite;
  animation-delay: ${props => props.delay};
  width: 270px;
  height: 270px;
  cursor: pointer;
  @media (max-width: 680px) {
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
  }
`
const Form = styled.form`
color: white;
background-color: #262626;
opacity: .7;
box-shadow: black 3px 3px 8px 3px;
border-radius: 8px;
animation: ${Bob} 5s ease-in-out infinite;
  animation-delay: ${props => props.delay};
  width: 270px;
  height: 270px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  @media (max-width: 680px) {
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
  }
`
const JoinMessage = styled.p`
  margin: 0;
  color: white;
  font-family: 'Russo One';
  font-size: 18px;
  @media (max-width: 680px) {
    font-size: 13px;
    text-wrap: wrap;
  }
`

const Input = styled.input`
  font-size: 18px;
  border-radius: 8px;
  @media (max-width: 680px) {
    font-size: 15px;
    
  }
`

const JoinButton = styled.button`
  background: transparent;
  border: 1px solid white;
  border-radius: 8px;
  padding: 5px 8px;
  font-family: 'Russo One';
  color: white;
  font-size: 20px;
  cursor: pointer;
  &:disabled {
      opacity: .5;
      cursor: default;
  }
`

const LogoutButton = styled.button`
position: absolute;
top: 3%;
left: 3%;
color: white;
background-color: #262626;
opacity: .7;
box-shadow: black 3px 3px 8px 3px;
border-radius: 8px;
border: none;
padding: 10px 15px;
font-family: 'Russo One';
cursor: pointer;
&:active {
  transform: translatey(3px);
  box-shadow: none;
}
`
export const ChooseGame = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const roomId = useSelector((store) => store.game.user.userId)
  const [joinFriend, setJoinFriend] = useState(false)
  const [friendRoomId, setFriendRoomId] = useState()
  const [startRoom, setStartRoom] = useState(false)


  useEffect(() => {
    if (!roomId) {
      history.push('/login')
    }
  }, [roomId, history])

  const goToFriendRoom = (e) => {
    e.preventDefault()
    dispatch(game.actions.setRoomId({ roomId: friendRoomId }))
    history.push(`/game/${friendRoomId}`)
  }

  const goToMyRoom = () => {
    dispatch(game.actions.setRoomId({ roomId }))
    history.push(`/game/${roomId}`)
  }

  const logOut = () => {
    dispatch(game.actions.signout())
    history.push('/login')
  }
  return (
    <Container>
      <LogoutButton onClick={() => logOut()}>Logout</LogoutButton>
      <Stars />
      <Logo text="PICK DESTINATION" />
      <ContentContainer>
        {!startRoom && <NavButton type="button" onClick={() => setStartRoom(true)}>Start my <br></br> own room</NavButton>}
        {startRoom && <Form>
          <JoinMessage>Share my code</JoinMessage>
          <JoinMessage>{roomId}</JoinMessage>
          <JoinButton onClick={() => goToMyRoom()} >Start</JoinButton>
        </Form>}
        {!joinFriend && <NavButton type="button" delay="1s" onClick={() => setJoinFriend(!joinFriend)}>Join <br></br> Friend's Room</NavButton>}
        {joinFriend &&
          <Form onSubmit={(e) => goToFriendRoom(e)} >
            <JoinMessage>Enter friend code</JoinMessage>
            <Input type="text" required onChange={(e) => setFriendRoomId(e.target.value)}></Input>
            <JoinButton disabled={!friendRoomId} type="submit">Join</JoinButton>
          </Form>
        }
      </ContentContainer>
    </Container>
  )
}