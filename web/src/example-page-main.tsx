import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import './index.css'
import ExamplePage from './pages/ExamplePage'

render(
  <StrictMode>
    <ExamplePage />
  </StrictMode>,
  document.getElementById('root')
)
