import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import './index.css'
import Page1 from './pages/Page1'

render(
  <StrictMode>
    <Page1 />
  </StrictMode>,
  document.getElementById('root')
)
