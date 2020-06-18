import React from 'react'
import styled, { keyframes } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointRight } from '@fortawesome/free-solid-svg-icons'

const NameContainer = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;
  left: -20px;
  margin: 5px 0;
`
const Point = keyframes`
0% {left: -8px};
50% {left: -3px};
100% {left: -8px};
`

const Hand = styled.span`
  color: ${props => props.color === 'black' ? '#be913a' : '#427c6d'};
  font-size: 22px;
  position: relative;
  left: -8px;
  top: 4px;
  animation: ${Point} .5s infinite ease-in;
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  
`

const Name = styled.p`
  color: ${props => props.check ? 'red' : props.color};
  font-size: 24px;
  margin: 0;
  font-family: 'Russo One';
  text-shadow: ${props => props.color === 'black' ? '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white' :
    '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'};
  
`

const ResignButton = styled.button`
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


const CheckStatus = styled.p`
//   color: ${props => props.count === 3 ? 'black' : props.count === 2 ? 'orange' : 'red'};
  font-size: 20px;
  margin: 0;
`

const Icon = <FontAwesomeIcon className="hand" icon={faHandPointRight} />
export const PlayerName = ({ player, currentTurn, inCheck, checkCount, socket }) => {

  const resign = () => {
    socket.emit('resign', 'I resign')
  }

  return (
    <NameContainer>
      <Hand show={currentTurn === player.color} color={player.color}>{Icon}</Hand>
      <Name color={player.color} check={inCheck === player.color}>{player.username}</Name>
      {inCheck === player.color && <ResignButton onClick={() => resign()}>Resign</ResignButton>}
    </NameContainer>
  )
}