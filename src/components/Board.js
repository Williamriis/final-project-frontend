import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

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
  const [squares, setSquares] = useState()
  const baseImageUrl = '/Users/williamjensen/Desktop/technigo/final-project-frontend/chess-app/src/assets/'

  useEffect(() => {
    fetch('http://localhost:8080/squares')
      .then((res) => res.json())
      .then((json) => {
        setSquares(json.sort((a, b) => (a.row > b.row) ? 1 :
          (a.row === b.row) ? (a.column > b.column) ? 1 : -1 : -1))
      })
  }, [])



  return (
    <>
      {squares &&
        <Board>
          {squares.map((square, index) => {
            const imageUrl = square.piece ? require(`../assets/${square.piece.image}`) : ''
            return <Square key={index} index={index} row={square.row}
              valid={square.valid}>{square.piece && <PieceImage src={imageUrl} />}</Square>
          })}
        </Board>}
      {!squares && < h1 > Loading..</h1>}
    </>
  )

}