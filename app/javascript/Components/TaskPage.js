import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import Header from './Header'
import SideBar from './SideBar'
import Project from './Project/Project'
import { requestNewProject, updateProjectName, deleteProject } from "./Project/DatabaseOp";

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
  const [projInfoUpdated, setProjInfoUpdated] = useState(true)

  // Load Data
  useEffect( () => {
    if (projInfoUpdated) {
      axios.get('/api/v1/projects')
      .then( resp => {
        setIsLoading(false)
        setProjects(resp.data)
      })
      .catch( data => {
        
        debugger
      })

      setProjInfoUpdated(false)
    }
    
  }, [projInfoUpdated])

  const addProjOnClick = () => {
    requestNewProject().then((resp) => {
      setProjects([...projects, resp.data])
    })
  }

  const editProjName = (projId, newName) => {
    updateProjectName(projId, newName).then((resp) => {
      projects.filter((project, index) => 
        project.id == projId
      )[0].name = newName
      setProjInfoUpdated(true)
    })
  }

  const delProj = (projId) => {
    deleteProject(projId).then((resp) => {
      setProjects(projects.filter((project, index) => project.id != projId))
      setProjInfoUpdated(true)
      
      if (projectToLoad.id == projId) {
        setProjectToLoad(null)
      }
    })
  }

  return (
    <React.Fragment>
      <Header />
      <SideBar isLoading={isLoading} projects={projects} onClick={projectButtonOnClick(projects, setProjectToLoad)} addProjOnClick={addProjOnClick} editProjName={editProjName} delProj={delProj} />
      <ContentDiv>
        {
          !projectToLoad
            ? <div style={{textAlign: 'center', width: '100%', marginTop: '10px'}}>Select a Project!</div>
            : <Project projectInfo={projectToLoad}/>
        }
      </ContentDiv>
    </React.Fragment>
  )
}

export default TaskPage