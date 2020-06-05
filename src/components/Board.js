import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchAndStore, setPiece } from '../reducers/game'

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
  background-color: ${props => props.index % 2 === 0 && props.row % 2 === 0 ? 'white' :
    props.index % 2 !== 0 && props.row % 2 !== 0 ? 'white' : 'navy'};
border: ${props => props.valid ? '5px solid green' : 'none'}
`

const PieceImage = styled.img`
  width: 100%;
  height: 100%;
`

// const AudioPlayer = styled.audio`
//   display: none;
// `
// const Promotion = styled.button`
//   background: transparent;
//   border: none;
// `

export const SetGame = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const squares = useSelector((store) => store.game.squares)
  const activePiece = useSelector((store) => store.game.activePiece)
  const currentTurn = useSelector((store) => store.game.currentTurn)
  const error = useSelector((store) => store.game.errorMessage)
  const host = useSelector((store) => store.game.host)

  useEffect(() => {
    dispatch(fetchAndStore(params.roomid))
  }, [dispatch, currentTurn])

  const movePiece = (baseSquare, targetSquare) => {
    //document.getElementById('sound').play()
    dispatch(
      setPiece(baseSquare, targetSquare, params.roomid)
    )

  }

  return (
    <>
      {squares.length > 0 &&
        <>
          {host && <h1>{host}'s room</h1>}
          <Board>
            {squares.map((square, index) => {
              const imageUrl = square._id === activePiece._id ? require(`../assets/active-${square.piece.image}`) :
                square.piece && square.piece.image ? require(`../assets/${square.piece.image}`) : ''
              return <Square key={square._id} index={index} row={square.row}
                valid={square.valid}
                onClick={() => movePiece(square, square)}>{square.piece && square.piece.image && <PieceImage src={imageUrl} />}</Square>
            })}
          </Board>
        </>}
      {/* <AudioPlayer id="sound" src={require('../assets/oldman.mp3')} preload controls /> */}
      {error && < h1 > {error}</h1>}
      {!squares && < h1 > Loading..</h1>}
    </>
  )

}