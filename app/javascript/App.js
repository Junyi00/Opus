import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import TaskPage from './Components/TaskPage'
import NotFoundPage from './NotFoundPage'

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App