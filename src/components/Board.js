import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchAndStore, setPiece, resetGame, pawnPromotion } from '../reducers/game'
import { game } from '../reducers/game'




const Board = styled.div`
  display: grid;
  grid-template-columns: 70px 70px 70px 70px 70px 70px 70px 70px;
  grid-template-rows: 70px 70px 70px 70px 70px 70px 70px 70px;
  border: 3px solid red;
`

const Square = styled.button`
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  margin: 0;
  background-color: ${props => props.user === 'white' ? props.index % 2 === 0 && props.row % 2 === 0 ? 'white' :
    props.index % 2 !== 0 && props.row % 2 !== 0 ? 'white' : 'navy' : props.index % 2 !== 0 && props.row % 2 !== 0 ? 'white' :
      props.index % 2 === 0 && props.row % 2 === 0 ? 'white' : 'navy'};
border: ${props => props.valid ? '5px solid green' : 'none'}
`

const PieceImage = styled.img`
  width: 100%;
  height: 100%;
`

const AudioPlayer = styled.audio`
   display: none;
`
const Promotion = styled.button`
  background: transparent;
  border: none;
`

export const SetGame = () => {
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
    dispatch(resetGame())
  }

  const promotePawn = (piece) => {
    dispatch(pawnPromotion(piece, params.roomid))
  }

  return (
    <>
      {squares && squares.length > 0 &&
        <>
          {host && <h1 style={{ color: "white" }}>{host}'s room</h1>}
          <button type="button" onClick={() => reset()}>New Game</button>
          {foesLostPieces && foesLostPieces.length > 0 && foesLostPieces.map((piece) => {
            const imgUrl = require(`../assets/${piece.image}`)
            return <Promotion type="button"><img src={imgUrl} style={{ height: "50px", width: "50px" }} /></Promotion>
          })}
          <Board>
            {squares.map((square, index) => {
              const imageUrl = square._id === activePiece._id ? require(`../assets/active-${square.piece.image}`) :
                square.piece && square.piece.image ? require(`../assets/${square.piece.image}`) : ''
              return <Square key={square._id} index={index} row={square.row} user={user.color}
                disabled={(activePiece && !square.valid) || (!activePiece && square.piece && square.piece.color && square.piece.color !== currentTurn) || (!activePiece && !square.piece) || (!activePiece && square.piece && !square.piece.type)}
                valid={square.valid}
                onClick={() => movePiece(square, square)}>{square.piece && square.piece.image && <PieceImage src={imageUrl} />}</Square>
            })}
          </Board>
          {myLostPieces && myLostPieces.length > 0 && myLostPieces.map((piece) => {
            const imgUrl = require(`../assets/${piece.image}`)
            return <Promotion type="button"
              disabled={promote !== user.color}
              onClick={() => promotePawn(piece)}><img src={imgUrl} style={{ height: "50px", width: "50px" }} /></Promotion>
          })}
          <h1 style={{ color: check === "black" ? "black" : "whit" }}>In check: {check && check}</h1>
        </>}
      {/* {<AudioPlayer id="sound" src={require('../assets/oldman.mp3')} preload controls />} */}
      {error && < h1 > {error}</h1>}
      {!squares && < h1 > Loading..</h1>}
    </>
  )

}