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

  return {on, toggle, getTogglerProps}
}

function App() {
  const {on, getTogglerProps} = useToggle()

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
