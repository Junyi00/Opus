import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import Header from './Header'
import SideBar from './SideBar'
import Project from './Project/Project'

const VerticalContentDiv = styled.div`
  display: flex;
  flex-flow: column; 
  height: 100%;
`

const HorizontalContentDiv = styled.div`
  display: flex;
  flex-flow: row; 
  width: 100%;
`

const GrowDiv = styled.div`
  display: flex;
  flex: 1 1 auto;
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

  return (
    <VerticalContentDiv>
      <Header />

      <GrowDiv>
        <HorizontalContentDiv>
          <SideBar isLoading={isLoading} projects={projects} onClick={projectButtonOnClick(projects, setProjectToLoad)}/>

          <GrowDiv>
            {
              !projectToLoad
                ? <div style={{textAlign: 'center', width: '100%'}}>Select a Project!</div>
                : <Project projectInfo={projectToLoad}/>
            }
            </GrowDiv>
          </HorizontalContentDiv>
      </GrowDiv>
    </VerticalContentDiv>
  )
}

export default TaskPage