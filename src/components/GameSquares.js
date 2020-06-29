import React, { useRef } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { game, setPiece } from '../reducers/game'
import { MovementArrow } from './MovementArrow'

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
  filter: brightness(${props => props.valid ? '130%' : '100%'})

`

const PieceImage = styled.img`
  width: 100%;
  height: 100%;
`

export const GameSquares = ({ squares, activePiece, socket, user, lastMove, currentTurn }) => {
    const dispatch = useDispatch()
    const params = useParams()

    const refs = {
        11: useRef(),
        12: useRef(),
        13: useRef(),
        14: useRef(),
        15: useRef(),
        16: useRef(),
        17: useRef(),
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

    const movePiece = (baseSquare, targetSquare) => {
        dispatch(
            setPiece(baseSquare, targetSquare, params.roomid, socket)
        )
        if (baseSquare.piece && baseSquare.piece.type && baseSquare.piece.type.includes('king') && !baseSquare.piece.moved) {
            dispatch(game.actions.castleValidator({ piece: baseSquare }))
        } else if (baseSquare.piece && baseSquare.piece.type && baseSquare.piece.type.includes('pawn')) {
            dispatch(game.actions.enPassantValidator({ piece: baseSquare }))
        }
    }

    return (
        <>
            {squares.map((square, index) => {
                const imageUrl = square._id === activePiece._id ? require(`../assets/active-${square.piece.image}`) :
                    square.piece && square.piece.image ? require(`../assets/${square.piece.image}`) : ''
                return <Square
                    ref={refs[square.row.toString() + square.column.toString()]}
                    color={user.color} key={square._id}
                    index={index}
                    row={square.row}
                    column={square.column}
                    user={user.color}
                    lastMove={lastMove}
                    disabled=
                    {(activePiece && !square.valid) ||
                        (!activePiece && square.piece && square.piece.color && square.piece.color !== currentTurn) ||
                        (!activePiece && square.piece && square.piece.color && square.piece.color !== user.color) ||
                        (!activePiece && !square.piece) || (!activePiece && square.piece && !square.piece.type)}
                    valid={square.valid}
                    onClick={() => movePiece(square, square)}>
                    {square.piece && square.piece.image &&
                        <PieceImage src={imageUrl} />}
                </Square>
            })}
            <MovementArrow lastMove={lastMove} refs={refs} />
        </>
    )
}
