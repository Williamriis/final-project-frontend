import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
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
// const Promotion = styled.button`
//   background: transparent;
//   border: none;
// `

export const SetGame = () => {
  const dispatch = useDispatch()
  const squares = useSelector((store) => store.game.squares)
  const activePiece = useSelector((store) => store.game.activePiece)

  useEffect(() => {
    dispatch(fetchAndStore())
  }, [dispatch])

  const movePiece = (baseSquare, targetSquare) => {
    dispatch(
      setPiece(baseSquare, targetSquare)
    )

  }

  return (
    <>
      {squares &&
        <Board>
          {squares.map((square, index) => {
            const imageUrl = square === activePiece ? require(`../assets/active-${square.piece.image}`) :
              square.piece ? require(`../assets/${square.piece.image}`) : ''
            return <Square key={square._id} index={index} row={square.row}
              valid={square.valid}
              onClick={() => movePiece(square, square)}>{square.piece && <PieceImage src={imageUrl} />}</Square>
          })}
        </Board>}
      {!squares && < h1 > Loading..</h1>}
    </>
  )

}