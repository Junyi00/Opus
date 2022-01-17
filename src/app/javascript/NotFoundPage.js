import React from "react"
import { Link } from "react-router-dom"

import OpusLogo from 'images/Opus_Logo.png'

const NotFoundPage = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <img src={OpusLogo} width={200}></img>
      <h1>404 Page Not Found</h1>

      <Link style={{marginTop: '10px', textAlign:'center', color:'var(--highlight-color)'}} to="/">
        Click here <br /> 
        to return to the home page!
      </Link>
    </div>
  )
}

export default NotFoundPage