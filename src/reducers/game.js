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
            const { baseSquare, targetSquare } = action.payload
            state.activePiece = baseSquare
        },

        resetPiece: (state) => {
            state.activePiece = false
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
            dispatch(game.actions.moveCalculator({ baseSquare, targetSquare }))
        } else if (state.game.activePiece && state.game.activePiece === targetSquare) {
            dispatch(game.actions.resetPiece())
        } else if (state.game.activePiece) {
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