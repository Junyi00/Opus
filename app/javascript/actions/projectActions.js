import axios from "axios";

export const retrieveProject = (projectId) => (dispatch) => {
  axios.get('/api/v1/projects/' + projectId)
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    dispatch({ type: 'SET_INITIAL', data: resp.data.children });
  })
  .catch((resp) => {
    // dispatch({ type: 'ADD_ERROR', error: resp.message, request_type: 'addUser' })
    debugger
  })
}

export const createLane = (projectId) => (dispatch) => {
  axios.post(
    '/api/v1/lanes',
    {
      name: 'New Lane',
      project_id: projectId
    }
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    dispatch({ type: 'CREATE_LANE', data: resp.data });
  })
}

export const updateLane = (laneId, data) => (dispatch) => {
  axios.patch(
    '/api/v1/lanes/' + laneId, 
    data
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    dispatch({ type: 'UPDATE_LANE', laneId: laneId, data: data });
  })
}

export const deleteLane = (laneId) => (dispatch) => {
  axios.delete(
    '/api/v1/lanes/' + laneId
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    dispatch({ type: 'DELETE_LANE', laneId: laneId });
  })
  .catch((resp) => {
    // dispatch({ type: 'ADD_ERROR', error: resp.message, request_type: 'addUser' })
    debugger
  })
}