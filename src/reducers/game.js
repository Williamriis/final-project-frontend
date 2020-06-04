import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    squares: [
    ],
    activePiece: false
}

export const game = createSlice({
    name: 'game',
    initialState,
    reducers: {

        storeSquares: (state, action) => {
            const { squares } = action.payload
            state.squares = squares
            state.activePiece = false
        },

        moveCalculator: (state, action) => {
            const { baseSquare } = action.payload
            state.activePiece = baseSquare
            if (baseSquare.piece.type.includes('pawn') && baseSquare.piece.moved) {
                if (baseSquare.piece.color === 'white') {
                    state.squares.forEach((square) => {
                        if ((baseSquare._id === square._id)) {
                            square.valid = true;
                        } else if (square.column === baseSquare.column && square.row === baseSquare.row + 1 && !square.piece.type) {
                            square.valid = true
                        } else if ((square.column === baseSquare.column + 1 || square.column === baseSquare.column - 1) &&
                            square.row === baseSquare.row + 1 &&
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
                        } else if (square.column === baseSquare.column && square.row === baseSquare.row - 1 && !square.piece.type) {
                            square.valid = true;
                        } else if ((square.column === baseSquare.column + 1 || square.column === baseSquare.column - 1) &&
                            square.row === baseSquare.row - 1 && square.piece.color && square.piece.color !== baseSquare.piece.color) {
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
                            } else if (square.column === baseSquare.column && square.row === baseSquare.row + i && !square.piece) {
                                square.valid = true;
                            } else if (square.column === baseSquare.column && square.row === baseSquare.row + i && square.piece) {
                                i = 5;
                            }
                        })
                    }
                    state.squares.forEach((square) => {
                        if ((square.column === baseSquare.column + 1 || square.column === baseSquare.column - 1) &&
                            square.row === baseSquare.row + 1 &&
                            square.piece && square.piece.color !== baseSquare.piece.color) {
                            square.valid = true;
                        }

                    })

                } else if (baseSquare.piece.color === 'black') {
                    let i = -1;
                    for (i = -1; i >= -2; i--) {
                        state.squares.forEach((square) => {
                            if (baseSquare._id === square._id) {
                                square.valid = true;
                            } else if (square.column === baseSquare.column && square.row === baseSquare.row + i && !square.piece) {
                                square.valid = true;
                            } else if (square.column === baseSquare.column && square.row === baseSquare.row + i && square.piece) {
                                i = -5;
                            }
                        })
                    }
                    state.squares.forEach((square) => {
                        if ((square.column === baseSquare.column + 1 || square.column === baseSquare.column - 1) &&
                            square.row === baseSquare.row - 1 &&
                            square.piece && square.piece.color !== baseSquare.piece.color) {
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
                                if (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && square.piece && square.piece.color !== baseSquare.piece.color) {
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
                                if (square.piece && square.piece.color !== baseSquare.piece.color) {
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
                                    if (square.piece && square.piece.color !== baseSquare.piece.color) {
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
                                    if (square.row === baseSquare.row + offset.x && square.column === baseSquare.column + offset.y && square.piece && square.piece.color !== baseSquare.piece.color) {
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
        }
    }
})



export const fetchAndStore = () => {
    return (dispatch) => {
        fetch('https://william-chess-board.herokuapp.com/squares')
            .then((res) => res.json())
            .then((json) => {
                dispatch(
                    game.actions.storeSquares({
                        squares: json.sort((a, b) => (a.row > b.row) ? 1 :
                            (a.row === b.row) ? (a.column > b.column) ? 1 : -1 : -1)
                    })
                )
            })
    }
}

export const setPiece = (baseSquare, targetSquare) => {
    return (dispatch, getState) => {
        const state = getState()
        if (state.game.activePiece === false && baseSquare.piece) {
            dispatch(game.actions.moveCalculator({ baseSquare }))
        } else if (state.game.activePiece && state.game.activePiece._id === targetSquare._id) {
            dispatch(game.actions.resetPiece())
        } else if (state.game.activePiece) {
            console.log('fetch fired')
            fetch('https://william-chess-board.herokuapp.com/movepiece', {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ baseSquare: state.game.activePiece, targetSquare })
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(
                        game.actions.storeSquares({
                            squares: json.sort((a, b) => (a.row > b.row) ? 1 :
                                (a.row === b.row) ? (a.column > b.column) ? 1 : -1 : -1)
                        })
                    )
                })
        }
    }
}