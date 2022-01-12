import axios from "axios"
import { resetProjectLayout, retrieveProjectLayout } from "./projectLayoutActions"

export const retriveUserProjects = (userId) => (dispatch) => {
  return axios.get(
    '/api/v1/projects/?user_id=' + userId
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    return dispatch({ type: 'SET_INITIAL_PROJECTS', data: resp.data })
  })
  .catch((resp) => {
    return dispatch({ type: 'ADD_ERROR', error_type:'app', critical: true, message: 'Failed to retrieve your projects', data: resp.message })
  })
}

export const resetProjects = () => (dispatch) => {
  return dispatch({ type: 'RESET_PROJECTS' })
}

export const createProject = (userId) => (dispatch) => {
  return axios.post(
    '/api/v1/projects',
    {
      name: 'New Project',
      user_id: userId
    }
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    return dispatch({ type: 'CREATE_PROJECT', data: resp.data })
  })
  .catch((resp) => {
    return dispatch({ type: 'ADD_ERROR', error_type:'app', critical: false, message: 'Failed to create project', data: resp.message })
  })
}

export const updateProject = (projId, data) => (dispatch) => {
  return axios.patch(
    '/api/v1/projects/' + projId,
    {
      project: data
    }
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    return dispatch({ type: 'UPDATE_PROJECT', projId: projId, data: resp.data })
  })
  .catch((resp) => {
    return dispatch({ type: 'ADD_ERROR', error_type:'app', critical: false, message: 'Failed to update project details', data: resp.message })
  })
}

export const deleteProject = (projId) => (dispatch) => {
  return axios.delete(
    '/api/v1/projects/' + projId
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    dispatch(resetSelectedProject())
    return dispatch({ type: 'DELETE_PROJECT', projId: projId })
  })
  .catch((resp) => {
    return dispatch({ type: 'ADD_ERROR', error_type:'app', critical: false, message: 'Failed to delete project', data: resp.message })
  })
}

export const resetSelectedProject = () => (dispatch) => {
  dispatch(resetProjectLayout())
  return dispatch({ type: 'RESET_SELECTED_PROJECT' })
}

export const selectProject = (selectedIndex) => (dispatch, getState) => {
  const projects = getState().projects.projects
  dispatch(retrieveProjectLayout(projects[selectedIndex].id))
  return dispatch({ type: 'SELECT_PROJECT', selectedIndex: selectedIndex })
}