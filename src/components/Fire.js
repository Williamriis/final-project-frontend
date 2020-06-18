import React from 'react'
import styled, { keyframes } from 'styled-components'

const flicker = keyframes`
0%   {transform: rotate(-1deg);}
20%  {transform: rotate(1deg);}
40%  {transform: rotate(-1deg);}
60%  {transform: rotate(1deg) scaleY(1.04);}
80%  {transform: rotate(-2deg) scaleY(0.92);}
100% {transform: rotate(1deg);}
`

const Container = styled.div`

  width: 50px;
  height: 50px;
  position:relative;
  transform-origin:center bottom;
  animation-name: ${flicker};
  animation-duration:3ms;
  animation-delay:200ms;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`
const RedFlame = styled.div`
bottom:0;
position:absolute;
border-bottom-right-radius: 50%;
border-bottom-left-radius: 50%;
border-top-left-radius: 50%;
transform:rotate(-45deg) scale(1.5,1.5);
left:5px;
width: 40px;
height: 40px;
background:OrangeRed;
box-shadow: 0px 0px 5px 4px OrangeRed;
`
const OrangeFlame = styled.div`
bottom:0;
position:absolute;
border-bottom-right-radius: 50%;
border-bottom-left-radius: 50%;
border-top-left-radius: 50%;
transform:rotate(-45deg) scale(1.5,1.5);
left:10px; 
  width: 30px;
  height: 30px;
  background:orange;
  box-shadow: 0px 0px 9px 4px orange;
`
const YellowFlame = styled.div`
bottom:0;
position:absolute;
border-bottom-right-radius: 50%;
border-bottom-left-radius: 50%;
border-top-left-radius: 50%;
transform:rotate(-45deg) scale(1.5,1.5);
left:15px; 
  width: 20px;
  height: 20px;
  background:gold;
  box-shadow: 0px 0px 9px 4px gold;
`
const WhiteFlame = styled.div`
bottom:0;
position:absolute;
border-bottom-right-radius: 50%;
border-bottom-left-radius: 50%;
border-top-left-radius: 50%;
transform:rotate(-45deg) scale(1.5,1.5);
left:15px; 
bottom:-4px;
width: 20px;
height: 20px;
background:white;
box-shadow: 0px 0px 9px 4px white;
`


export const Flames = () => {

  return (
    <>
      <Container>
        <RedFlame></RedFlame>
        <OrangeFlame></OrangeFlame>
        <YellowFlame></YellowFlame>
        <WhiteFlame></WhiteFlame>
      </Container>

    </>
  )
}