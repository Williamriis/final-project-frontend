import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'


export const ChooseGame = () => {
    const history = useHistory()
    const roomId = useSelector((store) => store.game.user.userId)
    const [joinFriend, setJoinFriend] = useState(false)
    const [friendRoomId, setFriendRoomId] = useState()

    const goToRoom = (e) => {
        e.preventDefault()
        history.push(`/game/${friendRoomId}`)
    }
    return (
        <div>
            <Link to={`/game/${roomId}`}>Start my own room</Link>
            <button type="button" onClick={() => setJoinFriend(!joinFriend)}>Join Friend's Room</button>
            {joinFriend &&
                <form onSubmit={(e) => goToRoom(e)}>
                    <input type="text" required onChange={(e) => setFriendRoomId(e.target.value)}></input>
                </form>
            }
        </div>
    )
}