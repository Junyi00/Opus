import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import Header from './Header'
import SideBar from './SideBar'
import Project from './Project/Project'
import { requestNewProject } from "./Project/DatabaseOp";

const ContainerDiv = styled.div`
  margin-top: var(--header-height);

  width: 100%;
  height: 100%;
`

const ContentDiv = styled.div`
  position: absolute;
  top: var(--header-height);
  left: var(--sidebar-width);
  right: 0px;
  bottom: 0px;
`

const projectButtonOnClick = (projects, f) => {
  return (index) => {
    return () => {
      f(projects[index])
    }
  }
}

const TaskPage = () => {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectToLoad, setProjectToLoad] = useState(null)

  // Load Data
  useEffect( () => {
    axios.get('/api/v1/projects')
    .then( resp => {
      setIsLoading(false)
      setProjects(resp.data)
    })
    .catch( data => {
      
      debugger
    })
  }, [])

  const addProjOnClick = () => {
    requestNewProject().then((resp) => {
      setProjects([...projects, resp.data])
    })
  }

  return (
    <React.Fragment>
      <Header />
      <SideBar isLoading={isLoading} projects={projects} onClick={projectButtonOnClick(projects, setProjectToLoad)} addProjOnClick={addProjOnClick}/>
      <ContentDiv>
        {
          !projectToLoad
            ? <div style={{textAlign: 'center', width: '100%'}}>Select a Project!</div>
            : <Project projectInfo={projectToLoad}/>
        }
      </ContentDiv>
    </React.Fragment>
  )
}

export default TaskPage