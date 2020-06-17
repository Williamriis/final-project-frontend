import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Rodal from 'rodal'
import 'rodal/lib/rodal.css'
import { resetGame } from '../reducers/game'
import { Crown } from './Crown'

const MessageText = styled.p`
  margin: 0;
  font-size: 20px;
  font-family: 'Russo One';
`
const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`

const Button = styled.button`
  color: white;
background-color: #262626;
opacity: .7;
box-shadow: black 3px 3px 8px 3px;
border-radius: 8px;
border: none;
padding: 10px 15px;
font-family: 'Russo One';
cursor: pointer;
&:active {
  transform: translatey(3px);
  box-shadow: none;
}
`


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
            <MessageText>{winMessage()}</MessageText>
            <Crown />
            <ButtonContainer>{user.username === host.username && <Button type="button" onClick={() => reset()}>Play Again</Button>}
                {user.username !== host.username && <Button type="button" onClick={() => setShowWinner(false)}>Stay in Room</Button>}
                <Button type="button" onClick={() => leaveRoom()}>Leave Room</Button>
            </ButtonContainer>

        </Rodal>
    )
}