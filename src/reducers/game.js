import { createSlice } from '@reduxjs/toolkit'
import io from 'socket.io-client'
//import { socket } from '../components/socket'
//import { otherSocket } from '../components/socket'

let socket = io(`http://localhost:8080/`)
const initialState = {
    squares: [
    ],
    user: {
        username: false,
        userId: false,
        accessToken: false,
        color: null
    },
    activePiece: false,
    currentTurn: "white",
    host: false,
    errorMessage: false,
    roomid: null,
    inCheck: false,
    lastMove: false,
    lostPieces: {
        white: [],
        black: []
    },
    promote: false

}

export const game = createSlice({
    name: 'game',
    initialState,
    reducers: {

        storeSquares: (state, action) => {
            const { squares, reset } = action.payload
            const clone = squares.map((square) => square)
            const sorted = clone.sort((a, b) => (a.row > b.row) ? 1 : (a.row === b.row) ? (a.column > b.column) ? 1 : -1 : -1)
            state.squares = state.user.color === "white" ? sorted.reverse() : sorted
            state.activePiece = false
            state.errorMessage = false
            if (reset) {
                state.lostPieces.white = []
                state.lostPieces.black = []
            }
        },

        newTurn: (state, action) => {
            const { currentTurn } = action.payload
            state.currentTurn = currentTurn
        },

        moveCalculator: (state, action) => {
            const { baseSquare } = action.payload
            state.activePiece = baseSquare
            if (baseSquare.piece.type.includes('pawn') && baseSquare.piece.moved) {
                if (baseSquare.piece.color === 'white') {
                    state.squares.forEach((square) => {
                        if ((baseSquare._id === square._id)) {
                            square.valid = true;
                        } else if ((square.column === baseSquare.column && square.row === baseSquare.row + 1 && square.piece && !square.piece.type) ||
                            (square.column === baseSquare.column && square.row === baseSquare.row + 1 && !square.piece)) {
                            square.valid = true
                        } else if ((square.column === baseSquare.column + 1 || square.column === baseSquare.column - 1) &&
                            square.row === baseSquare.row + 1 && square.piece &&
                            square.piece.color && square.piece.color !== baseSquare.piece.color) {
                            square.valid = true
                        } else {
                            square.valid = false;
                        }
                    })
                } else {
                    state.squares.forEach((square) => {
                        if (baseSquare._id === square._id) {
                            square.valid = true;
                        } else if ((square.column === baseSquare.column && square.row === baseSquare.row - 1 && square.piece && !square.piece.type) ||
                            (square.column === baseSquare.column && square.row === baseSquare.row - 1 && !square.piece)) {
                            square.valid = true;
                        } else if ((square.column === baseSquare.column + 1 || square.column === baseSquare.column - 1) &&
                            square.row === baseSquare.row - 1 && square.piece && square.piece.color && square.piece.color !== baseSquare.piece.color) {
                            square.valid = true;
                        } else {
                            square.valid = false;
                        }

                    })
                }


            } else if (baseSquare.piece.type.includes('pawn') && !baseSquare.piece.moved) {
                if (baseSquare.piece.color === 'white') {
                    let i = 1;
                    for (i = 1; i <= 2; i++) {
                        state.squares.forEach((square) => {
                            if (baseSquare._id === square._id) {
                                square.valid = true;
                            } else if ((square.column === baseSquare.column && square.row === baseSquare.row + i && !square.piece) ||
                                (square.column === baseSquare.column && square.row === baseSquare.row + i && square.piece && !square.piece.color)) {
                                square.valid = true;
                            } else if (square.column === baseSquare.column && square.row === baseSquare.row + i && square.piece) {
                                i = 5;
                            }
                        })
                    }
                    state.squares.forEach((square) => {
                        if ((square.column === baseSquare.column + 1 || square.column === baseSquare.column - 1) &&
                            square.row === baseSquare.row + 1 &&
                            square.piece && square.piece.type && square.piece.color !== baseSquare.piece.color) {
                            square.valid = true;
                        }

                    })

                } else if (baseSquare.piece.color === 'black') {
                    let i = -1;
                    for (i = -1; i >= -2; i--) {
                        state.squares.forEach((square) => {
                            if (baseSquare._id === square._id) {
                                square.valid = true;
                            } else if ((square.column === baseSquare.column && square.row === baseSquare.row + i && square.piece && !square.piece.color) ||
                                (square.column === baseSquare.column && square.row === baseSquare.row + i && !square.piece)) {
                                square.valid = true;
                            } else if (square.column === baseSquare.column && square.row === baseSquare.row + i && square.piece) {
                                i = -5;
                            }
                        })
                    }
                    state.squares.forEach((square) => {
                        if ((square.column === baseSquare.column + 1 || square.column === baseSquare.column - 1) &&
                            square.row === baseSquare.row - 1 &&
                            square.piece && square.piece.type && square.piece.color !== baseSquare.piece.color) {
                            square.valid = true;
                        }

                    })
                }

            } else if (baseSquare.piece.type.includes('bishop')) {

                const bishopMoves = [
                    { x: 1, y: 1 },
                    { x: 1, y: -1 },
                    { x: -1, y: 1 },
                    { x: -1, y: -1 }
                ]
                bishopMoves.forEach((dir) => {
                    let scale = 1;
                    for (scale = 1; scale <= 8; scale++) {
                        let offset = { x: dir.x * scale, y: dir.y * scale }
                        state.squares.forEach((square) => {
                            if ((baseSquare._id === square._id) ||
                                (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y)) {
                                if (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && square.piece && square.piece.color && square.piece.color !== baseSquare.piece.color) {
                                    square.valid = true;
                                    scale = 9;
                                } else if ((square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && !square.piece) ||
                                    (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && !square.piece.type) ||
                                    baseSquare._id === square._id) {
                                    square.valid = true;
                                } else {
                                    square.valid = false;
                                    scale = 9;
                                }
                            }
                        })
                    }
                })

            } else if (baseSquare.piece.type.includes('rook')) {
                const rookMoves = [
                    { x: 0, y: 1 },
                    { x: 0, y: -1 },
                    { x: 1, y: 0 },
                    { x: -1, y: 0 }
                ]
                rookMoves.forEach((dir) => {
                    let scale = 1;
                    for (scale = 1; scale <= 8; scale++) {
                        const offset = { x: dir.x * scale, y: dir.y * scale }
                        state.squares.forEach((square) => {
                            if ((square.column === baseSquare.column && square.row === baseSquare.row + offset.x) ||
                                (square.row === baseSquare.row && square.column === baseSquare.column + offset.y)) {
                                if (square.piece && square.piece.color && square.piece.color !== baseSquare.piece.color) {
                                    square.valid = true;
                                    scale = 9;
                                } else if ((square.column === baseSquare.column && square.row === baseSquare.row + offset.x && !square.piece) ||
                                    (square.column === baseSquare.column && square.row === baseSquare.row + offset.x && square.piece && !square.piece.type) ||
                                    (square.row === baseSquare.row && square.column === baseSquare.column + offset.y && !square.piece) ||
                                    (square.row === baseSquare.row && square.column === baseSquare.column + offset.y && square.piece && !square.piece.type) ||
                                    (baseSquare._id === square._id)) {
                                    square.valid = true;
                                } else {
                                    square.valid = false;
                                    scale = 9;
                                }

                            }
                        })
                    }
                })

            } else if (baseSquare.piece.type.includes('knight')) {
                const knightMoves = [
                    { x: 2, y: 1 },
                    { x: -2, y: 1 },
                    { x: 2, y: -1 },
                    { x: -2, y: -1 },
                    { x: 1, y: 2 },
                    { x: 1, y: -2 },
                    { x: -1, y: 2 },
                    { x: -1, y: -2 }
                ]

                knightMoves.forEach((dir) => {
                    let scale = 1;
                    for (scale = 1; scale <= 1; scale++) {
                        const offset = { x: dir.x * scale, y: dir.y * scale }
                        state.squares.forEach((square) => {
                            if (baseSquare._id === square._id) {
                                square.valid = true;
                            } else if ((square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y) &&
                                (!square.piece || square.piece.color !== baseSquare.piece.color)) {
                                square.valid = true;
                                scale = 9;
                            }
                        })
                    }
                })
            } else if (baseSquare.piece.type.includes('queen')) {

                const queenMoves = [
                    { x: 0, y: 1, type: "straight" },
                    { x: 0, y: -1, type: "straight" },
                    { x: 1, y: 0, type: "straight" },
                    { x: -1, y: 0, type: "straight" },
                    { x: 1, y: 1, type: "diagonal" },
                    { x: 1, y: -1, type: "diagonal" },
                    { x: -1, y: 1, type: "diagonal" },
                    { x: -1, y: -1, type: "diagonal" }
                ]
                queenMoves.forEach((dir) => {
                    let scale = 1;
                    for (scale = 1; scale <= 8; scale++) {
                        const offset = { x: dir.x * scale, y: dir.y * scale }
                        if (dir.type === "straight") {
                            state.squares.forEach((square) => {
                                if ((square.column === baseSquare.column && square.row === baseSquare.row + offset.x) ||
                                    (square.row === baseSquare.row && square.column === baseSquare.column + offset.y)) {
                                    if (square.piece && square.piece.color && square.piece.color !== baseSquare.piece.color) {
                                        square.valid = true;
                                        scale = 9;
                                    } else if ((square.column === baseSquare.column && square.row === baseSquare.row + offset.x && !square.piece) ||
                                        (square.column === baseSquare.column && square.row === baseSquare.row + offset.x && square.piece && !square.piece.color) ||
                                        (square.row === baseSquare.row && square.column === baseSquare.column + offset.y && !square.piece) ||
                                        (square.row === baseSquare.row && square.column === baseSquare.column + offset.y && square.piece && !square.piece.color) ||
                                        (baseSquare._id === square._id)) {
                                        square.valid = true;
                                    } else {
                                        square.valid = false;
                                        scale = 9;
                                    }
                                }
                            })
                        } else {
                            state.squares.forEach((square) => {
                                if ((baseSquare._id === square._id) ||
                                    (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y)) {
                                    if (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && square.piece && square.piece.color && square.piece.color !== baseSquare.piece.color) {
                                        square.valid = true;
                                        scale = 9;
                                    } else if ((square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && !square.piece) ||
                                        (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && square.piece && !square.piece.color) ||
                                        baseSquare._id === square._id) {
                                        square.valid = true;
                                    } else {
                                        square.valid = false;
                                        scale = 9;
                                    }
                                }
                            })
                        }
                    }

                })
            } else if (baseSquare.piece.type.includes('king')) {
                const kingMoves = [
                    { x: 0, y: 1, type: "straight" },
                    { x: 0, y: -1, type: "straight" },
                    { x: 1, y: 0, type: "straight" },
                    { x: -1, y: 0, type: "straight" },
                    { x: 1, y: 1, type: "diagonal" },
                    { x: 1, y: -1, type: "diagonal" },
                    { x: -1, y: 1, type: "diagonal" },
                    { x: -1, y: -1, type: "diagonal" }
                ]
                kingMoves.forEach((dir) => {
                    let scale = 1;
                    for (scale = 1; scale <= 1; scale++) {
                        const offset = { x: dir.x * scale, y: dir.y * scale }
                        if (dir.type === "straight") {
                            state.squares.forEach((square) => {
                                if ((square.column === baseSquare.column && square.row === baseSquare.row + offset.x) ||
                                    (square.row === baseSquare.row && square.column === baseSquare.column + offset.y)) {
                                    if (square.piece && square.piece.color !== baseSquare.piece.color && square.piece.type !== 'king') {
                                        square.valid = true;
                                        scale = 9;
                                    } else if ((square.column === baseSquare.column && square.row === baseSquare.row + offset.x && !square.piece) ||
                                        (square.row === baseSquare.row && square.column === baseSquare.column + offset.y && !square.piece) ||
                                        (baseSquare._id === square._id)) {
                                        square.valid = true;
                                    } else {
                                        square.valid = false;
                                        scale = 9;
                                    }
                                }
                            })
                        } else {
                            state.squares.forEach((square) => {
                                if ((baseSquare._id === square._id) ||
                                    (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y)) {
                                    if (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && square.piece && square.piece.color !== baseSquare.piece.color && square.piece.type !== 'king') {
                                        square.valid = true;
                                        scale = 9;
                                    } else if ((square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && !square.piece) ||
                                        baseSquare._id === square._id) {
                                        square.valid = true;
                                    } else {
                                        square.valid = false;
                                        scale = 9;
                                    }
                                }
                            })
                        }
                    }

                })
            }
        },

        resetPiece: (state) => {
            state.activePiece = false
            state.squares.forEach((square) => {
                square.valid = false
            })
        },

        storeUser: (state, action) => {
            const { accessToken, userId, username, color } = action.payload
            console.log('store user exectures')
            state.user.username = username;
            state.user.userId = userId;
            state.user.accessToken = accessToken
            state.user.color = color

        },

        setHost: (state, action) => {
            const { host } = action.payload
            state.host = host
        },

        errorHandler: (state, action) => {
            const { error } = action.payload
            state.errorMessage = error
        },

        setRoomId: (state, action) => {
            const { roomId } = action.payload
            state.roomid = roomId
        },
        setCheck: (state, action) => {
            const { check } = action.payload
            state.inCheck = check
        },
        setLastMove: (state, action) => {
            const { movedFrom, movedTo, pieceMoved } = action.payload
            state.lastMove = {
                movedFrom: movedFrom,
                movedTo: movedTo,
                pieceMoved: pieceMoved,
                pieceTaken: movedTo.piece && movedTo.piece.type ? movedTo.piece : false
            }
        },

        castleValidator: (state, action) => {
            console.log('castle check')
            const { piece } = action.payload
            const blankSquaresLeft = state.squares.filter((square) => square.row === piece.row && square.column > 1 && square.column < 5 && !square.piece.type)
            const blankSquaresRight = state.squares.filter((square) => square.row === piece.row && square.column > 5 && square.column < 8 && !square.piece.type)
            if (piece.piece.color !== state.inCheck) {
                state.squares.forEach((square) => {
                    if (square.row === piece.row && square.piece.type && square.piece.type.includes('rook') && !square.piece.moved) {
                        if (square.column === 1 && blankSquaresLeft.length === 3) {
                            square.valid = true;
                        } else if (square.column === 8 && blankSquaresRight.length === 2) {
                            square.valid = true;
                        }
                    }
                })
            }
        },
        enPassantValidator: (state, action) => {
            //this will need to be fixed: lastMove must be determined by backend otherwise remote players will
            //only ever save their own moves in state.
            const { piece } = action.payload
            if (state.activePiece) {
                if (state.lastMove.pieceMoved && state.lastMove.pieceMoved.type.includes('pawn')) {
                    if (state.lastMove.movedFrom.row - state.lastMove.movedTo.row === piece.piece.color === 'white' ? 2 : -2) {

                        if (state.lastMove.movedTo.row === piece.row && (state.lastMove.movedTo.column === piece.column + 1 || piece.column - 1)) {
                            console.log('enPassant')
                            const enPassantSquare = piece.piece.color === 'white' ? state.squares.find((square) => square.column === state.lastMove.movedFrom.column && square.row === state.lastMove.movedFrom.row - 1)
                                : state.squares.find((square) => square.column === state.lastMove.movedFrom.column && square.row === state.lastMove.movedFrom.row + 1)
                            enPassantSquare.valid = true;
                        }
                    }
                }
            } else { }

        },
        takenPiece: (state, action) => {
            const { takenPiece } = action.payload
            const existing = state.lostPieces[takenPiece.color].find((piece) => piece.type === takenPiece.type)
            if (!existing) {
                state.lostPieces[takenPiece.color].push(takenPiece)
            } else { }
        },
        promoteValidator: (state, action) => {
            const { promote, promotedPiece } = action.payload
            if (promotedPiece) {
                state.lostPieces[promotedPiece.color] = state.lostPieces[promotedPiece.color].filter((piece) => piece.type !== promotedPiece.type)
                state.promote = false
            } else {
                state.promote = promote

            }
        }
    }
})



export const fetchAndStore = (roomid) => {
    return (dispatch, getState) => {
        const state = getState()
        fetch(`http://localhost:8080/game/${roomid}`, {
            headers: { 'Authorization': state.game.user.accessToken, 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.message) {
                    dispatch(game.actions.errorHandler({ error: json.message }))
                } else {

                    dispatch(
                        game.actions.storeUser({
                            username: json.username, accessToken: state.game.user.accessToken,
                            userId: state.game.user.userId, color: json.color
                        })
                    )
                    dispatch(
                        game.actions.storeSquares({
                            squares: json.gameBoard.sort((a, b) => (a.row > b.row) ? 1 :
                                (a.row === b.row) ? (a.column > b.column) ? 1 : -1 : -1)
                        })
                    )

                    dispatch(
                        game.actions.setHost({
                            host: json.host
                        })
                    )
                }

            })
    }
}

export const setPiece = (baseSquare, targetSquare, roomid) => {

    return async (dispatch, getState) => {
        const state = getState()
        if (state.game.activePiece === false && baseSquare.piece) {
            dispatch(game.actions.moveCalculator({ baseSquare }))
        } else if (state.game.activePiece && state.game.activePiece._id === targetSquare._id) {
            dispatch(game.actions.resetPiece())
        } else if (state.game.activePiece) {
            dispatch(game.actions.setLastMove({ movedFrom: state.game.activePiece, movedTo: targetSquare, pieceMoved: state.game.activePiece.piece }))
            if (state.game.activePiece.piece.type.includes('king') && targetSquare.piece && targetSquare.piece.type && targetSquare.piece.type.includes('rook')) {
                socket.emit('castle', { baseSquare: state.game.activePiece, targetSquare, color: state.game.currentTurn, roomid: roomid })
            } else if (state.game.activePiece.piece.type.includes('pawn') && (targetSquare.column === state.game.activePiece.column + 1 || targetSquare.column === state.game.activePiece.column - 1) && ((targetSquare.piece && !targetSquare.piece.type) || !targetSquare.piece)) {
                socket.emit('enPassant', { oldSquare: state.game.activePiece, targetSquare, color: state.game.currentTurn, roomid })
            } else if (state.game.activePiece.piece.type.includes('pawn') && ((state.game.activePiece.piece.color === "white" && targetSquare.row === 8 && state.game.lostPieces.white.length > 0)
                || (state.game.activePiece.piece.color === "black" && targetSquare.row === 1 && state.game.lostPieces.black.length > 0))) {
                socket.emit('movePiece', { baseSquare: state.game.activePiece, targetSquare, color: state.game.currentTurn, roomid: roomid, promote: true })
            } else {
                socket.emit('movePiece', { baseSquare: state.game.activePiece, targetSquare, color: state.game.currentTurn, roomid: roomid })
            }

            // fetch(`http://localhost:8080/game/${roomid}/movepiece`, {
            //     method: 'POST',
            //     headers: { 'Authorization': state.game.user.accessToken, 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ baseSquare: state.game.activePiece, targetSquare, color: state.game.currentTurn })
            // })
            //     .then((res) => res.json())
            //     .then((json) => {
            //     dispatch(
            //         game.actions.storeSquares({
            //             squares: json.board.sort((a, b) => (a.row > b.row) ? 1 :
            //                 (a.row === b.row) ? (a.column > b.column) ? 1 : -1 : -1)
            //         })
            //     )
            //     dispatch(
            //         game.actions.newTurn({ currentTurn: json.currentTurn })
            //     )
            //})
            socket.on('update', data => {
                if (data.takenPiece) {
                    dispatch(game.actions.takenPiece({ takenPiece: data.takenPiece }))
                }
                if (data.promote) {
                    dispatch(game.actions.promoteValidator({ promote: data.promote }))
                }
                if (data.promotedPiece) {

                    dispatch(game.actions.promoteValidator({ promotedPiece: data.promotedPiece }))
                }
                dispatch(game.actions.storeSquares({ squares: data.board.board }))
                dispatch(
                    game.actions.newTurn({ currentTurn: data.currentTurn })
                )
            })
            socket.on('check', data => {
                dispatch(game.actions.setCheck({ check: data }))
            })





        }
    }
}


export const UserSignUp = (username, email, password) => {
    return (dispatch) => {
        console.log(username)
        fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username: username, email: email, password: password })
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.error) {
                    console.log(json.error)
                } else {
                    dispatch(
                        game.actions.storeUser({ accessToken: json.accessToken, userId: json.id, username: json.username })
                    )
                }
            })
    }
}
export const resetGame = () => {
    return (dispatch, getState) => {
        const state = getState()
        fetch(`http://localhost:8080/game/${state.game.user.userId}/reset`)
            .then((res) => res.json())
            .then((json) => {
                dispatch(game.actions.storeSquares({ squares: json, reset: true }))
                dispatch(game.actions.setCheck({ check: false }))
                dispatch(game.actions.newTurn({ currentTurn: 'white' }))
            })
    }

}
export const pawnPromotion = (piece, roomid) => {

    return (dispatch, getState) => {
        const state = getState()
        socket.emit('pawnPromotion', { piece, targetSquare: state.game.lastMove.movedTo, roomid, color: state.game.currentTurn })
    }

}

