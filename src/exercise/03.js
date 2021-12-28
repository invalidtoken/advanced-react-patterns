// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

const ToggleContext = React.createContext(null)
ToggleContext.displayName = 'ToggleContext'

const useToggleContext = () => {
  const toggleContext = React.useContext(ToggleContext)
  if (!toggleContext) {
    throw new Error('useToggle must be used inside the ToggleContext')
  }

  return toggleContext
}

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return (
    <div>
      <ToggleContext.Provider value={{on, toggle}}>
        {children}
      </ToggleContext.Provider>
    </div>
  )
}

// 🐨 Flesh out each of these components

// Accepts `on` and `children` props and returns `children` if `on` is true
const ToggleOn = ({children}) => {
  const {on} = useToggleContext()
  return on ? children : null
}

// Accepts `on` and `children` props and returns `children` if `on` is false
const ToggleOff = ({children}) => {
  const {on} = useToggleContext()
  return !on ? children : null
}

// Accepts `on` and `toggle` props and returns the <Switch /> with those props.
const ToggleButton = () => {
  const {on, toggle} = useToggleContext()

  return <Switch on={on} onClick={toggle} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Hello</span>
        <div>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
