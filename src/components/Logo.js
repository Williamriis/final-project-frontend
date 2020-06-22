import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Header = styled.p`
  font-family: 'Russo One';
  color: white;
  font-size: 60px;
  margin: 0;
  text-shadow: black 2px 2px;
  filter: drop-shadow(0 0 6px #699bff);
  @media (max-width: 680px) {
    font-size: 35px;
  }
`

const SubHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  align-items: center;
  width: 120%;
  justify-content: center;
  margin-top: -10px;
  @media (max-width: 680px) {
    margin-top: -5px;
  }
`

const LineContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  align-items: ${props => props.align};
  
`
const Line = styled.div`
  height: 5px;
  width: ${props => props.width};
  background-color: white;
  margin-top: 5px;
  box-shadow: black 1px 1px 1px 1px;
  @media (max-width: 680px) {
    height: 3px;
  }
`

const SubHeader = styled.p`
  font-size: 30px;
  font-family: 'Russo One';
  color: white;
  margin: 0;
  text-shadow: black 2px 2px;
padding: 0 10px;
@media (max-width: 680px) {
  font-size: 16px;
}
`

export const Logo = ({ text }) => {

  return (
    <Container>
      <Header>CHESS ACADEMY</Header>
      <SubHeaderContainer>
        <LineContainer align={"flex-end"}>
          <Line width={"90%"}></Line>
          <Line width={"100%"}></Line>
        </LineContainer>
        <SubHeader >{text}</SubHeader>
        <LineContainer align={"flex-start"}>
          <Line width={"90%"}></Line>
          <Line width={"100%"}></Line>
        </LineContainer>
      </SubHeaderContainer>
    </Container>
  )
}