import React from 'react'
import styled from 'styled-components'
import Rodal from 'rodal'
import 'rodal/lib/rodal.css'
import { Spaceman } from './Spaceman'

const MessageText = styled.p`
  font-family: 'Russo One';
  font-size: 20px;
  margin: 0;
`

export const PlayerJoinedModal = ({ showGuest, setShowGuest, guest }) => {

    return (
        <Rodal visible={showGuest} onClose={() => setShowGuest(false)}>
            {/* <Spaceman /> */}
            <MessageText>{guest} has come aboard!</MessageText>
        </Rodal>
    )
}