import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons'


const ErrorContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`
const ErrorText = styled.p`
font-family: 'Russo One';
color: white;
filter: drop-shadow(0 0 6px red);
font-size: 15px;
margin-left: 10px;
`


export const ErrorMessage = ({ text }) => {

    return (
        <ErrorContainer>
            <FontAwesomeIcon icon={faRobot} style={{ color: 'red', fontSize: '24px' }} />
            <ErrorText>{text}</ErrorText>
        </ErrorContainer>
    )
}