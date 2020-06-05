import React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from '@reduxjs/toolkit'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import { game } from './reducers/game'
import { SetGame } from './components/Board'
import { Signup } from './pages/Signup'
import { ChooseGame } from './pages/ChooseGame'
import './App.css';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('boardLayout', serializedState)
  } catch (error) {
    console.log(error)
  }
}

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('boardLayout')
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (error) {
    console.log(error)
    return undefined
  }
}


const reducer = combineReducers({
  game: game.reducer
})

const persistedState = loadFromLocalStorage()

const store = createStore(reducer, persistedState, composeEnhancer(applyMiddleware(thunk)))

store.subscribe(() => saveToLocalStorage(store.getState()))

export const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Switch>
          <Route path='/' exact>
            <Signup />
          </Route>
          <Route path='/game' exact>
            <ChooseGame />
          </Route>
          <Route path='/game/:roomid' exact>
            <SetGame />
          </Route>
        </Switch>

      </Provider>
    </BrowserRouter>
  );
}


