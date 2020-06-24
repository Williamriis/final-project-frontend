import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    messages: []
}

export const chat = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const { message } = action.payload
            state.messages.push(message)
        }

    }
})

export const updateMessages = (socket) => {

    return (dispatch) => {
        socket.on('newMessage', data => {
            dispatch(chat.actions.addMessage({ message: data }))
        })
    }
}