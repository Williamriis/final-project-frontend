import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Rodal from 'rodal'
import 'rodal/lib/rodal.css'
import { resetGame } from '../reducers/game'

export const WinModal = ({ showWinner, setShowWinner, user, host, winner, opponent, roomid }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const leaveRoom = () => {
        history.push('/game')
    }

    const reset = () => {
        dispatch(resetGame(roomid))
    }

    const winMessage = () => {
        if (user.username === host) {
            if (winner === 'white') {
                return `${host.username} wins!`
            } else {
                return `${opponent} wins!`
            }
        } else {
            if (winner === 'white') {
                return `${host.username} wins!`
            } else {
                return `${user.username} wins!`
            }
        }
    }

    return (
        <Rodal visible={showWinner} onClose={() => setShowWinner(false)}>
            <h1>{winMessage()}</h1>
            {user.username === host.username && <button type="button" onClick={() => reset()}>Play Again</button>}
            {user.username !== host.username && <button type="button" onClick={() => setShowWinner(false)}>Stay in Room</button>}
            <button type="button" onClick={() => leaveRoom()}>Leave Room</button>
        </Rodal>
    )
}