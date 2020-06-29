import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { fetchAndStore, pawnPromotion, socketEvents } from '../reducers/game'
import { game } from '../reducers/game'
import { WinModal } from './WinModal'
import { PlayerJoinedModal } from './PlayerJoinedModal'
import { PlayerName } from './PlayerName'
import { Chat } from './Chat'
import { FormButton } from './FormComponents'
import io from 'socket.io-client'
import { GameSquares } from './GameSquares'

const Container = styled.section`
  display: flex;
  justify-content: space-around;
  width: 100vw;
  align-items: center;
  
`

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const RoomName = styled.h1`
  color: white;
  font-family: 'Russo One';
  font-size: 30px;
  text-shadow: 2px 2px black;
  @media (max-width: 680px) {
    font-size: 20px;
  }
`
const Board = styled.div`
margin-top: 10px;
width: 560px;
  display: grid;
  grid-template-columns: 70px 70px 70px 70px 70px 70px 70px 70px;
  grid-template-rows: 70px 70px 70px 70px 70px 70px 70px 70px;
  box-shadow: black 3px 3px 8px 3px;
 
 @media (max-width: 680px) {
   width: 336px;
  grid-template-columns: 42px 42px 42px 42px 42px 42px 42px 42px;
  grid-template-rows: 42px 42px 42px 42px 42px 42px 42px 42px;
 }
`

const AudioPlayer = styled.audio`
   display: none;
`
const LostPiecesContainer = styled.div`
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  display: flex;
  margin-bottom: 30px;
  height: 20px;
  flex-wrap: wrap;
  width: 560px;
  @media (max-width: 680px) {
    width: 336px;
  }
`
const Promotion = styled.button`
  background: transparent;
  border: none;
`
const LostPiece = styled.img`
  height: 25px;
  width: 25px;
  @media (max-width: 680px) {
    height: 20px;
    width: 20px;
  }
`
const LogoutButton = styled.button`
position: absolute;
top: 3%;
right: 3%;
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

export const SetGame = () => {
  const [showWinner, setShowWinner] = useState(false)
  const [showGuest, setShowGuest] = useState(false)
  const dispatch = useDispatch()
  const params = useParams()
  const history = useHistory()
  const squares = useSelector((store) => store.game.squares)
  const activePiece = useSelector((store) => store.game.activePiece)
  const currentTurn = useSelector((store) => store.game.currentTurn)
  const error = useSelector((store) => store.game.errorMessage)
  const host = useSelector((store) => store.game.host)
  const user = useSelector((store) => store.game.user)
  const check = useSelector((store) => store.game.inCheck)
  const myLostPieces = useSelector((store) => store.game.lostPieces[user.color])
  const foesLostPieces = useSelector((store) => store.game.lostPieces[user.color === "white" ? "black" : "white"])
  const promote = useSelector((store) => store.game.promote)
  const winner = useSelector((store) => store.game.winner)
  const opponent = useSelector((store) => store.game.opponent)
  const lastMove = useSelector((store) => store.game.lastMove)
  const playSound = useSelector((store) => store.game.playSound)
  const socket = useRef()

  //OPEN SOCKET TO LISTEN ONLY TO EVENTS IN THIS NAMESPACE AND CLOSES WHEN GAME IS LEFT
  useEffect(() => {
    socket.current = io(`https://william-chess-board.herokuapp.com/${params.roomid}?id=${params.roomid}`)
    return () => {
      socket.current.close()
    }
  }, [params.roomid])

  //SETS INITIAL BOARD STATE AND INITIALIZES SOCKET LISTENERS FOR FUTURE EVENTS
  useEffect(() => {
    dispatch(fetchAndStore(params.roomid, socket.current))
    dispatch(socketEvents(socket.current))
  }, [dispatch, params.roomid])

  useEffect(() => {
    if (playSound) {
      document.getElementById('sound').play()
      dispatch(game.actions.triggerSound(false))
    }
  }, [playSound, dispatch])

  useEffect(() => {
    if (winner) {
      setShowWinner(true)
    } else {
      setShowWinner(false)
    }
  }, [winner])

  useEffect(() => {
    if (opponent.username && user.username === host.username) {
      setShowGuest(true)
    }
  }, [opponent.username, host.username, user.username])


  const promotePawn = (piece) => {
    dispatch(pawnPromotion(piece, params.roomid, socket.current))
  }

  const leaveGame = () => {
    dispatch(game.actions.quitGame()
    )
    history.push('/game')
  }

  const loginRedirect = () => {
    history.push('/login')
  }

  return (
    <Container>
      {squares && squares.length > 0 &&
        <GameContainer>

          <LogoutButton onClick={() => leaveGame()}>Quit Game</LogoutButton>

          <WinModal showWinner={showWinner}
            setShowWinner={setShowWinner}
            host={host}
            user={user}
            opponent={opponent.username}
            winner={winner}
            roomid={params.roomid}
            socket={socket.current} />

          <PlayerJoinedModal showGuest={showGuest}
            setShowGuest={setShowGuest}
            guest={opponent.username} />

          {host && <RoomName>{host.username}'s room</RoomName>}

          <LostPiecesContainer show={foesLostPieces && foesLostPieces.length > 0}>
            {foesLostPieces && foesLostPieces.length > 0 && foesLostPieces.map((piece) => {
              const imgUrl = require(`../assets/${piece.image}`)
              return <Promotion type="button"><LostPiece src={imgUrl} /></Promotion>
            })}
          </LostPiecesContainer>

          {((user.username === host.username && opponent.username) ||
            (user.username !== host.username)) &&
            <PlayerName player={user.username === host.username ? opponent : host}
              inCheck={check}
              currentTurn={currentTurn}
              socket={socket.current}
              user={user.color} />}

          <Board color={user.color}>
            <GameSquares squares={squares} lastMove={lastMove} user={user} currentTurn={currentTurn} activePiece={activePiece} socket={socket.current} />
          </Board>

          <PlayerName player={user}
            inCheck={check}
            currentTurn={currentTurn}
            socket={socket.current}
            user={user.color} />

          <LostPiecesContainer show={myLostPieces && myLostPieces.length > 0}>
            {myLostPieces && myLostPieces.length > 0 && myLostPieces.map((piece) => {
              const imgUrl = require(`../assets/${piece.image}`)
              return <Promotion type="button"
                disabled={promote !== user.color}
                onClick={() => promotePawn(piece)}><LostPiece src={imgUrl} /></Promotion>
            })}
          </LostPiecesContainer>

        </GameContainer>}

      {<AudioPlayer id="sound" src={require('../assets/piece-click.wav')} preload controls />}

      {error &&

        <GameContainer>
          < RoomName > {error}</ RoomName>
          <FormButton onClick={() => loginRedirect()}>COME ABOARD</FormButton>
        </GameContainer>}

      {!squares && <RoomName > Loading..</RoomName>}
      {!error && <Chat socket={socket.current} host={host} />}
    </Container>
  )

}