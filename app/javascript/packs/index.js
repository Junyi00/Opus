// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { PopupProvider } from "react-popup-manager";

import Modal from 'react-modal';

import App from '../App'

const root = document.createElement('div')
root.id = 'root'

Modal.setAppElement(root)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <PopupProvider>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </PopupProvider>,
    document.body.appendChild(root),
  )
})
