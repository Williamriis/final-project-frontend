import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { game } from '../reducers/game'

export const ChooseGame = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const roomId = useSelector((store) => store.game.user.userId)
    const [joinFriend, setJoinFriend] = useState(false)
    const [friendRoomId, setFriendRoomId] = useState()

    const goToFriendRoom = (e) => {
        e.preventDefault()
        dispatch(game.actions.setRoomId({ roomId: friendRoomId }))
        history.push(`/game/${friendRoomId}`)
    }

    const goToMyRoom = () => {
        dispatch(game.actions.setRoomId({ roomId }))
        history.push(`/game/${roomId}`)
    }
    return (
        <div>
            <button type="button" onClick={() => goToMyRoom()}>Start my own room</button>
            <button type="button" onClick={() => setJoinFriend(!joinFriend)}>Join Friend's Room</button>
            {joinFriend &&
                <form onSubmit={(e) => goToFriendRoom(e)}>
                    <input type="text" required onChange={(e) => setFriendRoomId(e.target.value)}></input>
                    <button type="submit">Join</button>
                </form>
            }
        </div>
    )
}