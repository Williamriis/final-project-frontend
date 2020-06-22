import React from 'react'
import styled, { keyframes } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointRight, faSadTear } from '@fortawesome/free-solid-svg-icons'

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  left: -20px;
  margin: 5px 0;
  @media (max-width: 680px) {
    left: 0;
  }
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
  top: 2px;
  animation: ${Point} .5s infinite ease-in;
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  @media (max-width: 680px) {
    font-size: 20px;
  }
`

const Name = styled.p`
  color: ${props => props.check ? 'red' : props.color};
  font-size: 24px;
  margin: 0;
  font-family: 'Russo One';
  text-shadow: ${props => props.color === 'black' ? '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white' :
    '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'};
   @media (max-width: 680px) {
     font-size: 20px;
   }
`

const ResignButton = styled.button`
color: #262626;
font-size: 18px;
background-color: white;
opacity: .7;
box-shadow: red 3px 3px 8px 0px;
border-radius: 8px;
border: none;
padding: 2px 8px;
font-family: 'Russo One';
margin-left: 12px;
cursor: pointer;
&:active {
  transform: translatey(3px);
  box-shadow: none;
}
`


const Icon = <FontAwesomeIcon className="hand" icon={faHandPointRight} />
const ResignIcon = <FontAwesomeIcon style={{ fontSize: "18px" }} icon={faSadTear} />
export const PlayerName = ({ player, currentTurn, inCheck, checkCount, socket }) => {

  const resign = () => {
    socket.emit('resign', 'I resign')
  }

  return (
    <NameContainer>
      <Hand show={currentTurn === player.color} color={player.color}>{Icon}</Hand>
      <Name color={player.color} check={inCheck === player.color}>{player.username}</Name>
      {inCheck === player.color && <ResignButton onClick={() => resign()}>Resign {ResignIcon}</ResignButton>}
    </NameContainer>
  )
}