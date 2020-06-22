import React, { useEffect, useState, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { fetchAndStore, setPiece, resetGame, pawnPromotion } from '../reducers/game'
import { game } from '../reducers/game'
import { WinModal } from './WinModal'
import { PlayerJoinedModal } from './PlayerJoinedModal'
import { PlayerName } from './PlayerName'
import { Stars } from './Stars'
import io from 'socket.io-client'




const SpinBoard = (color) => keyframes`
  0%{transform: rotate(90deg)}
  100% {transform: rotate(${color === 'white' ? '0deg' : '0deg'})}
`

const SpinSquare = (color) => keyframes`
0%{transform: rotate(270deg)}
100% {transform: rotate(${color === 'white' ? '0deg' : '0deg'})}
`


const Container = styled.section`
  
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
  display: grid;
  grid-template-columns: 70px 70px 70px 70px 70px 70px 70px 70px;
  grid-template-rows: 70px 70px 70px 70px 70px 70px 70px 70px;
  box-shadow: black 3px 3px 8px 3px;
 //animation: ${props => SpinBoard(props.color)} 2s linear;
 //animation-fill-mode: forwards;
 @media (max-width: 680px) {
  grid-template-columns: 42px 42px 42px 42px 42px 42px 42px 42px;
  grid-template-rows: 42px 42px 42px 42px 42px 42px 42px 42px;
 }
`

const Square = styled.button`
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  margin: 0;
  background-color: ${props => props.user === 'white' ? props.index % 2 === 0 && props.row % 2 === 0 ? '#be913a' :
    props.index % 2 !== 0 && props.row % 2 !== 0 ? '#be913a' : '#427c6d' : props.index % 2 === 0 && props.row % 2 === 0 ? '#427c6d' :
      props.index % 2 !== 0 && props.row % 2 !== 0 ? '#427c6d' : '#be913a'};
border: ${props => props.valid ? '1px solid white' : (props.row === props.lastMove.movedFrom.row && props.column ===
    props.lastMove.movedFrom.column) || (props.row === props.lastMove.movedTo.row && props.column ===
      props.lastMove.movedTo.column) ? '1px solid purple' : 'none'};
 //animation: ${props => SpinSquare(props.color)} 2s linear;
 //animation-fill-mode: forwards;
  filter: brightness(${props => props.valid ? '130%' : '100%'})

`

const PieceImage = styled.img`
  width: 100%;
  height: 100%;
`

const AudioPlayer = styled.audio`
   display: none;
`
const LostPiecesContainer = styled.div`
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  display: flex;
  height: 20px;
  flex-wrap: wrap;
  @media (max-width: 680px) {
    width: 80%;
  }
`
const Promotion = styled.button`
  background: transparent;
  border: none;
`
const LostPiece = styled.img`
  height: 30px;
  width: 30px;
  @media (max-width: 680px) {
    height: 20px;
    width: 20px;
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

const MovementArrow = styled.div`
  background-color: purple;
  height: 3px;
  width: ${props => props.height}px;
  transform: rotateZ(${props => props.angle}deg);
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  z-index: 5;
`

export const SetGame = () => {
  const [showWinner, setShowWinner] = useState(false)
  const [showGuest, setShowGuest] = useState(false)
  const [arrowLength, setArrowLength] = useState(0)
  const [arrowOriginTop, setArrowOriginTop] = useState(0)
  const [arrowOriginLeft, setArrowOriginLeft] = useState(0)
  const [arrowAngle, setArrowAngle] = useState(0)
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
  const refs = {
    11: useRef(),
    12: useRef(),
    13: useRef(),
    14: useRef(),
    15: useRef(),
    16: useRef(),
    17: useRef(),
    18: useRef(),
    18: useRef(),
    21: useRef(),
    22: useRef(),
    23: useRef(),
    24: useRef(),
    25: useRef(),
    26: useRef(),
    27: useRef(),
    28: useRef(),
    31: useRef(),
    32: useRef(),
    33: useRef(),
    34: useRef(),
    35: useRef(),
    36: useRef(),
    37: useRef(),
    38: useRef(),
    41: useRef(),
    42: useRef(),
    43: useRef(),
    44: useRef(),
    45: useRef(),
    46: useRef(),
    47: useRef(),
    48: useRef(),
    51: useRef(),
    52: useRef(),
    53: useRef(),
    54: useRef(),
    55: useRef(),
    56: useRef(),
    57: useRef(),
    58: useRef(),
    61: useRef(),
    62: useRef(),
    63: useRef(),
    64: useRef(),
    65: useRef(),
    66: useRef(),
    67: useRef(),
    68: useRef(),
    71: useRef(),
    72: useRef(),
    73: useRef(),
    74: useRef(),
    75: useRef(),
    76: useRef(),
    77: useRef(),
    78: useRef(),
    81: useRef(),
    82: useRef(),
    83: useRef(),
    84: useRef(),
    85: useRef(),
    86: useRef(),
    87: useRef(),
    88: useRef()
  }



  useEffect(() => {
    socket.current = io(`https://william-chess-board.herokuapp.com/${params.roomid}?id=${params.roomid}`)

    return () => {
      socket.current.close()

    }
  }, [])

  useEffect(() => {
    if (lastMove.movedFrom.row) {
      setArrowAngle(0)
      const movedFrom = refs[lastMove.movedFrom.row.toString() + lastMove.movedFrom.column.toString()].current.getBoundingClientRect()
      const movedTo = refs[lastMove.movedTo.row.toString() + lastMove.movedTo.column.toString()].current.getBoundingClientRect()
      const x1 = movedFrom.left + (movedFrom.width / 2)
      const x2 = movedTo.left + (movedFrom.width / 2)
      const y1 = movedFrom.top + (movedFrom.width / 2)
      const y2 = movedTo.top + (movedFrom.width / 2)
      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2
      const slope = Math.atan2(y1 - y2, x1 - x2)
      const distance = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)))

      setArrowAngle((slope * 180) / Math.PI)
      setArrowLength(distance)
      setArrowOriginTop(midY)
      setArrowOriginLeft(midX - (distance / 2))

    } else {
      setArrowLength(0)
      setArrowOriginLeft(0)
      setArrowOriginTop(0)
      setArrowAngle(0)
    }


  }, [lastMove])



  useEffect(() => {
    if (playSound) {
      document.getElementById('sound').play()
      dispatch(game.actions.triggerSound(false))
    }
  }, [playSound])

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
  }, [opponent.username])

  useEffect(() => {
    dispatch(fetchAndStore(params.roomid, socket.current))
  }, [dispatch])

  const movePiece = (baseSquare, targetSquare) => {


    dispatch(
      setPiece(baseSquare, targetSquare, params.roomid, socket.current)
    )
    if (baseSquare.piece && baseSquare.piece.type && baseSquare.piece.type.includes('king') && !baseSquare.piece.moved) {
      dispatch(game.actions.castleValidator({ piece: baseSquare }))
    } else if (baseSquare.piece && baseSquare.piece.type && baseSquare.piece.type.includes('pawn')) {
      dispatch(game.actions.enPassantValidator({ piece: baseSquare }))
    }


  }

  const promotePawn = (piece) => {
    dispatch(pawnPromotion(piece, params.roomid, socket.current))
  }

  const leaveGame = () => {
    dispatch(game.actions.quitGame()
    )
    history.push('/game')
  }

  return (
    <Container>
      {squares && squares.length > 0 &&
        <>
          <LogoutButton onClick={() => leaveGame()}>Quit Game</LogoutButton>
          <WinModal showWinner={showWinner} setShowWinner={setShowWinner} host={host} user={user} opponent={opponent.username} winner={winner} roomid={params.roomid} socket={socket.current} />
          <PlayerJoinedModal showGuest={showGuest} setShowGuest={setShowGuest} guest={opponent.username} />
          {host && <RoomName>{host.username}'s room</RoomName>}
          <LostPiecesContainer show={foesLostPieces && foesLostPieces.length > 0}>
            {foesLostPieces && foesLostPieces.length > 0 && foesLostPieces.map((piece) => {
              const imgUrl = require(`../assets/${piece.image}`)
              return <Promotion type="button"><LostPiece src={imgUrl} /></Promotion>
            })}
          </LostPiecesContainer>
          {((user.username === host.username && opponent.username) ||
            (user.username !== host.username)) && <PlayerName player={user.username === host.username ? opponent : host} inCheck={check} currentTurn={currentTurn} socket={socket.current} />}

          <Board color={user.color}>
            {squares.map((square, index) => {

              const imageUrl = square._id === activePiece._id ? require(`../assets/active-${square.piece.image}`) :
                square.piece && square.piece.image ? require(`../assets/${square.piece.image}`) : ''
              return <Square ref={refs[square.row.toString() + square.column.toString()]} color={user.color} key={square._id} index={index} row={square.row} column={square.column} user={user.color} lastMove={lastMove}
                disabled={(activePiece && !square.valid) || (!activePiece && square.piece && square.piece.color && square.piece.color !== currentTurn) || (!activePiece && !square.piece) || (!activePiece && square.piece && !square.piece.type)}
                valid={square.valid}
                onClick={() => movePiece(square, square)}>{square.piece && square.piece.image && <PieceImage src={imageUrl} />}</Square>
            })}
            <MovementArrow height={arrowLength} top={arrowOriginTop} left={arrowOriginLeft} angle={arrowAngle}></MovementArrow>
          </Board>
          <PlayerName player={user} inCheck={check} currentTurn={currentTurn} socket={socket.current} />
          <LostPiecesContainer show={myLostPieces && myLostPieces.length > 0}>
            {myLostPieces && myLostPieces.length > 0 && myLostPieces.map((piece) => {
              const imgUrl = require(`../assets/${piece.image}`)
              return <Promotion type="button"
                disabled={promote !== user.color}
                onClick={() => promotePawn(piece)}><LostPiece src={imgUrl} /></Promotion>
            })}
          </LostPiecesContainer>
        </>}
      {<AudioPlayer id="sound" src={require('../assets/piece-click.wav')} preload controls />}
      {error && < h1 > {error}</h1>}
      {!squares && < h1 > Loading..</h1>}
    </Container>
  )

}