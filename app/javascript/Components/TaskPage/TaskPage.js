import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Header from './Header'
import SideBar from './SideBar'
import Project from './Project/Project'
import ErrorModal from './Modals/ErrorModal'
import { retriveUserProjects } from '../../actions/projectsActions'

const ContentDiv = styled.div`
  position: absolute;
  top: var(--header-height);
  left: var(--sidebar-width);
  right: 0px;
  bottom: 0px;

  overflow: scroll;
`

const TaskPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)

  const dispatch = useDispatch()
  const projectsState = useSelector((state) => state.projects)
  const userState = useSelector((state) => state.user)
  const appErrorState = useSelector((state) => state.errors.app)

  useEffect(() => {
    setIsLoading(true)
    dispatch(retriveUserProjects(userState.id)).then(resp => setIsLoading(false))
  }, [dispatch])  

  useEffect(() => {
    if (appErrorState !== null) {
      setShowErrorModal(true)
    }
  }, [appErrorState])

  return (
    <React.Fragment>
      { !userState.isLoggedIn && (<Navigate to="/home" replace={true} />)}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <SideBar isLoading={isLoading} />
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

export default TaskPage