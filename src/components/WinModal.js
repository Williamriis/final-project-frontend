import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Rodal from 'rodal'
import 'rodal/lib/rodal.css'
import { resetGame } from '../reducers/game'
import { game } from '../reducers/game'
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


export const WinModal = ({ showWinner, setShowWinner, user, host, winner, opponent, roomid, socket }) => {
    const history = useHistory()
    const dispatch = useDispatch()


    const reset = () => {

        dispatch(resetGame(roomid, socket))
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

    const closeModal = () => {

        setShowWinner(false)
        dispatch(resetGame(roomid, socket))

        if (host.left) {
            dispatch(game.actions.quitGame())
            dispatch(resetGame(roomid, socket))
            history.push('/game')
        }
    }

    return (
        <Rodal width={250} visible={showWinner} onClose={() => closeModal()}>
            <MessageText>{winMessage()}</MessageText>
            <Crown />
            {user.username === host.username && <ButtonContainer> <Button type="button" onClick={() => reset()}>Play Again</Button>

                {/* <Button type="button" onClick={() => leaveRoom()}>Leave Room</Button> */}
            </ButtonContainer>}

        </Rodal>
    )
}