// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {Switch} from '../switch'

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  const getTogglerProps = ({onClick, ...props} = {}) => {
    return {
      ...props,

      'aria-pressed': on,
      onClick: () => {
        onClick && onClick()
        toggle()
      },
    }
  }

  // 🐨 Add a property called `togglerProps`. It should be an object that has
  // `aria-pressed` and `onClick` properties.
  // 💰 {'aria-pressed': on, onClick: toggle}
  return {on, toggle, getTogglerProps}
}

function App() {
  const {on, getTogglerProps} = useToggle()

  const anything = {
    anything: '2000',
  }
  return (
    <div>
      <Switch {...getTogglerProps({on})} />
      <hr />
      <button
        aria-label="custom-button"
        {...getTogglerProps({onClick: () => console.info('onButtonClick')})}
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
