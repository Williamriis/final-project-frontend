import React from 'react'
import Rodal from 'rodal'
import 'rodal/lib/rodal.css'

export const PlayerJoinedModal = ({ showGuest, setShowGuest, guest }) => {

    return (
        <Rodal visible={showGuest} onClose={() => setShowGuest(false)}>
            <h1>{guest} has joined</h1>
        </Rodal>
    )
}