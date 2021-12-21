// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import supportsTouch from './supportsTouch'

import App from '../App'

const root = document.createElement('div')
root.id = 'root'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <DndProvider backend={supportsTouch() ? TouchBackend : HTML5Backend}>
      <App />
    </DndProvider>,
    document.body.appendChild(root),
  )
})
