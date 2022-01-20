import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { retriveUserProjects } from '../../actions/projectsActions'

import Header from '../Header'
import SideBar from './SideBar'
import Project from './Project'
import ErrorModal from './Modals/ErrorModal'

const ContentDiv = styled.div`
  position: absolute;
  top: var(--header-height);
  left: var(--sidebar-width);
  right: 0px;
  bottom: 0px;

  overflow: scroll;
`

const TaskPage = ({
  projectsState, userState, appErrorState, retriveUserProjects
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)

  useEffect(() => {
    retriveUserProjects(userState.id)
  }, [userState.id])  

  useEffect(() => { 
    if (appErrorState !== null) {
      setShowErrorModal(true)
    }
  }, [appErrorState])

  return (
    <React.Fragment>
      { !userState.isLoggedIn && (<Navigate to="/home" replace={true} />)}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <SideBar />
      <ContentDiv>
        {
          projectsState.selectedIndex === null
            ? <div style={{textAlign: 'center', width: '100%', marginTop: '10px'}}>Select a Project!</div>
            : <Project searchQuery={searchQuery} />
        }
      </ContentDiv>
      <ErrorModal 
        showModal={showErrorModal}
        setShowModal={setShowErrorModal}
      />
    </React.Fragment>
  )
}

export default connect(
  (state) => ({
    projectsState: state.projects,
    userState: state.user,
    appErrorState: state.errors.app
  }),
  (dispatch) => ({
    retriveUserProjects: (...args) => dispatch(retriveUserProjects(...args))
  })
)(TaskPage)