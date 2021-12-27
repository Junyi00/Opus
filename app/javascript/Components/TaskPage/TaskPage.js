import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

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

  overflow: scroll;
`

const TaskPage = () => {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projInfoUpdated, setProjInfoUpdated] = useState(true)

  const [projectToLoad, setProjectToLoad] = useState(null)
  const [projectDataChanged, setProjectDataChanged] = useState(true) // for manual rerender in Project

  const [searchQuery, setSearchQuery] = useState('')

  const userState = useSelector((state) => state.user)

  // Load Data
  useEffect( () => {
    if (projInfoUpdated) {
      axios.get('/api/v1/projects/?user_id=' + userState.id)
      .then( resp => {
        setIsLoading(false)
        setProjects(resp.data)
      })
      .catch( data => {
        debugger
      })

      setProjInfoUpdated(false)
    }
    
  }, [projInfoUpdated, userState])

  const projectButtonOnClick = (projects, f) => {
    return (index) => { // generate individual onclick for each project
      return () => {
        f(projects[index])
      }
    }
  }

  const addProjOnClick = () => {
    requestNewProject(userState.id).then((resp) => {
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
      { !userState.isLoggedIn && (<Navigate to="/home" replace={true} />)}
      <Header 
        projectLoaded={projectToLoad} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery} 
      />
      <SideBar 
        isLoading={isLoading} 
        projects={projects} 
        onClick={projectButtonOnClick(projects, (data) => {setProjectToLoad(data); setProjectDataChanged(true)})} 
        addProjOnClick={addProjOnClick} 
        editProjName={editProjName} delProj={delProj} 
      />
      <ContentDiv>
        {
          !projectToLoad
            ? <div style={{textAlign: 'center', width: '100%', marginTop: '10px'}}>Select a Project!</div>
            : <Project 
                projectInfo={projectToLoad} 
                searchQuery={searchQuery}
                projectDataChanged={projectDataChanged}
                setProjectDataChanged={setProjectDataChanged}
              />
        }
      </ContentDiv>
    </React.Fragment>
  )
}

export default TaskPage