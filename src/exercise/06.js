// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

const useControlledSwitchWarning = (
  controlPropValue,
  propName,
  componentName,
) => {
  const isUnControlled =
    controlPropValue === null || controlPropValue === undefined
  const {current: wasUnControlled} = React.useRef(isUnControlled)

  React.useEffect(() => {
    warning(
      !(!isUnControlled && wasUnControlled),
      `\`${componentName}\` is changing from uncontrolled to be controlled. Components should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${propName}\` prop.`,
    )

    warning(
      !(isUnControlled && !wasUnControlled),
      `\`${componentName}\` is changing from controlled to be uncontrolled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${propName}\` prop.`,
    )
  }, [isUnControlled, wasUnControlled, componentName, propName])
}

const useReadOnlySwitchWarning = ({
  controlPropValue,
  hasOnChange,
  readOnly,

  controlPropName,
  componentName,
  onChangePropName,
  initialValuePropName,
  readOnlyPropName,
}) => {
  const isUnControlled =
    controlPropValue === null || controlPropValue === undefined ? true : false

  React.useEffect(() => {
    warning(
      !(!isUnControlled && !hasOnChange && !readOnly),
      `An \`${controlPropName}\` prop was provided to ${componentName} without an \`${onChangePropName}\` handler. This will render a read-only toggle. If you want it to be mutable, use \`${initialValuePropName}\`. Otherwise, set either \`${onChangePropName}\` or \`${readOnlyPropName}\`.`,
    )
  }, [
    isUnControlled,
    hasOnChange,
    readOnly,
    controlPropName,
    componentName,
    onChangePropName,
    initialValuePropName,
    readOnlyPropName,
  ])
}

function useToggle({
  reducer = toggleReducer,

  readOnly = false,
  initialOn = false,
  on: controlledOn,
  onChange,
} = {}) {
  const {current: initialState} = React.useRef({
    on: initialOn,
  })
  const hasOnChange = !!onChange

  const isUnControlled =
    controlledOn === null || controlledOn === undefined ? true : false

  const [state, dispatch] = React.useReducer(reducer, initialState)

  const on = isUnControlled ? state.on : controlledOn

  useReadOnlySwitchWarning({
    hasOnChange,

    controlPropValue: controlledOn,
    controlPropName: 'on',

    readOnly,
    readOnlyPropName: 'readOnly',

    componentName: 'useToggle',
    initialValuePropName: 'initialOn',
    onChangePropName: 'onChange',
  })

  useControlledSwitchWarning(controlledOn, 'on', 'useToggle')

  const dispatchWithOnChange = action => {
    if (isUnControlled) {
      dispatch(action)
    }

    onChange && onChange(reducer({...state, on}, action), action)
  }

  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, ...rest}) {
  const {on, getTogglerProps} = useToggle({
    on: controlledOn,
    onChange,
    ...rest,
  })
  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
