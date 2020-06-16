import React from 'react'
import styled from 'styled-components'


export const FormButton = styled.button`
  background: white;
  filter: drop-shadow(0 0 6px #699bff);
  align-self: center;
  font-family: 'Russo One';
  font-size: 18px;
  opacity: .8;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  &:disabled {
      opacity: .4;
  }
`
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 35px;
  width: 300px;
`

export const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 20px;
  border-radius: 8px;
  border: none;
  background: white;
  opacity: .7;
  width: 100%;
`

export const FormText = styled.p`
  
  font-family: 'Russo One';
  color: white;
  filter: drop-shadow(0 0 6px white);
`