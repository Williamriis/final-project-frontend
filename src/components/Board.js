import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchAndStore, setPiece, resetGame, pawnPromotion } from '../reducers/game'
import { game } from '../reducers/game'
import { WinModal } from './WinModal'
import { PlayerJoinedModal } from './PlayerJoinedModal'
import { PlayerName } from './PlayerName'
import { Flames } from './Fire'
import { Stars } from './Stars'

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

const Board = styled.div`
  display: grid;
  grid-template-columns: 70px 70px 70px 70px 70px 70px 70px 70px;
  grid-template-rows: 70px 70px 70px 70px 70px 70px 70px 70px;
  box-shadow: black 3px 3px 8px 3px;
 //animation: ${props => SpinBoard(props.color)} 2s linear;
 //animation-fill-mode: forwards;
`

const Square = styled.button`
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  margin: 0;
  background-color: ${props => props.user === '#be913a' ? props.index % 2 === 0 && props.row % 2 === 0 ? '#be913a' :
    props.index % 2 !== 0 && props.row % 2 !== 0 ? '#be913a' : '#427c6d' : props.index % 2 === 0 && props.row % 2 === 0 ? '#427c6d' :
      props.index % 2 !== 0 && props.row % 2 !== 0 ? '#427c6d' : '#be913a'};
border: ${props => props.valid ? '5px solid green' : 'none'};
 //animation: ${props => SpinSquare(props.color)} 2s linear;
 //animation-fill-mode: forwards;
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
  height: 30px;
  flex-wrap: wrap;
`
const Promotion = styled.button`
  background: transparent;
  border: none;
`
const LostPiece = styled.img`
  height: 30px;
  width: 30px;
  
`


export const SetGame = () => {
  const [showWinner, setShowWinner] = useState(false)
  const [showGuest, setShowGuest] = useState(false)
  const dispatch = useDispatch()
  const params = useParams()
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
  const checkCount = useSelector((store) => store.game.checkCount)
  const winner = useSelector((store) => store.game.winner)
  const opponent = useSelector((store) => store.game.opponent)

  useEffect(() => {
    if (winner) {
      setShowWinner(true)
    } else {
      setShowWinner(false)
    }
  }, [winner])

  useEffect(() => {
    if (opponent && user.username === host.username) {
      setShowGuest(true)
    }
  }, [opponent])

  useEffect(() => {
    dispatch(fetchAndStore(params.roomid))
  }, [dispatch])

  const movePiece = (baseSquare, targetSquare) => {
    // document.getElementById('sound').play()

    dispatch(
      setPiece(baseSquare, targetSquare, params.roomid)
    )
    if (baseSquare.piece && baseSquare.piece.type && baseSquare.piece.type.includes('king') && !baseSquare.piece.moved) {
      dispatch(game.actions.castleValidator({ piece: baseSquare }))
    } else if (baseSquare.piece && baseSquare.piece.type && baseSquare.piece.type.includes('pawn')) {
      dispatch(game.actions.enPassantValidator({ piece: baseSquare }))
    }


  }
  const reset = () => {
    dispatch(resetGame(params.roomid))
  }

  const promotePawn = (piece) => {
    dispatch(pawnPromotion(piece, params.roomid))
  }

  return (
    <Container>
      {squares && squares.length > 0 &&
        <>
          <WinModal showWinner={showWinner} setShowWinner={setShowWinner} host={host} user={user} opponent={opponent.username} winner={winner} roomid={params.roomid} />
          <PlayerJoinedModal showGuest={showGuest} setShowGuest={setShowGuest} guest={opponent.username} />
          {host && <h1 style={{ color: "white", fontFamily: "Russo One", textShadow: "2px 2px black", fontSize: "30px" }}>{host.username}'s room</h1>}
          <Stars />

          <LostPiecesContainer show={foesLostPieces && foesLostPieces.length > 0}>
            {foesLostPieces && foesLostPieces.length > 0 && foesLostPieces.map((piece) => {
              const imgUrl = require(`../assets/${piece.image}`)
              return <Promotion type="button"><LostPiece src={imgUrl} /></Promotion>
            })}
          </LostPiecesContainer>
          {((user.username === host.username && opponent.username) ||
            (user.username !== host.username)) && <PlayerName player={user.username === host.username ? opponent : host} inCheck={check} currentTurn={currentTurn} checkCount={checkCount} />}

          <Board color={user.color}>
            {squares.map((square, index) => {
              const imageUrl = square._id === activePiece._id ? require(`../assets/active-${square.piece.image}`) :
                square.piece && square.piece.image ? require(`../assets/${square.piece.image}`) : ''
              return <Square color={user.color} key={square._id} index={index} row={square.row} user={user.color}
                disabled={(activePiece && !square.valid) || (!activePiece && square.piece && square.piece.color && square.piece.color !== currentTurn) || (!activePiece && !square.piece) || (!activePiece && square.piece && !square.piece.type)}
                valid={square.valid}
                onClick={() => movePiece(square, square)}>{square.piece && square.piece.image && <PieceImage src={imageUrl} />}</Square>
            })}
          </Board>
          <PlayerName player={user} inCheck={check} currentTurn={currentTurn} checkCount={checkCount} />
          <LostPiecesContainer show={myLostPieces && myLostPieces.length > 0}>
            {myLostPieces && myLostPieces.length > 0 && myLostPieces.map((piece) => {
              const imgUrl = require(`../assets/${piece.image}`)
              return <Promotion type="button"
                disabled={promote !== user.color}
                onClick={() => promotePawn(piece)}><LostPiece src={imgUrl} /></Promotion>
            })}
          </LostPiecesContainer>

        </>}
      {/* {<AudioPlayer id="sound" src={require('../assets/oldman.mp3')} preload controls />} */}
      {error && < h1 > {error}</h1>}
      {!squares && < h1 > Loading..</h1>}
      <Stars left={"70%"} top={"50%"} />
    </Container>
  )

}