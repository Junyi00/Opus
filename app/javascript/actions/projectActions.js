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
  .catch((resp) => {
    debugger
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
  .catch((resp) => {
    debugger
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
    debugger
  })
}

export const createTask = (laneId) => (dispatch) => {
  axios.post(
    '/api/v1/tasks',
    {
      name: 'New Task',
      description: 'A Description...',
      lane_id: laneId
    }
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    dispatch({ type: 'CREATE_TASK', laneId: laneId, data: resp.data });
  })
  .catch((resp) => {
    debugger
  })
}

export const updateTask = (laneId, taskId, data) => (dispatch) => {
  return axios.patch(
    '/api/v1/tasks/' + taskId, 
    { task: data }
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    dispatch({ type: 'UPDATE_TASK', laneId: laneId, taskId: taskId, data: data });
  })
  .catch((resp) => {
    debugger
  })
}

export const deleteTask = (laneId, taskId) => (dispatch) => {
  axios.delete(
    '/api/v1/tasks/' + taskId
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    dispatch({ type: 'DELETE_TASK', laneId: laneId, taskId: taskId });
  })
  .catch((resp) => {
    debugger
  })
}

export const createTags = (laneId, taskId, temp_tags) => (dispatch) => {
  axios.all(temp_tags.map((tag, index) => axios.post(
    'api/v1/tags',
    {
      name: tag.name,
      color: tag.color,
      task_id: tag.taskId
    }
  )))
  .then((resps) => {
    const tags = []
    for (let i=0; i<resps.length; i++) {
      const resp = resps[i]
      
      if (resp.data.status === 500) {
        throw new Error(resp.data.error)
      }

      tags.push(resp.data)
    }
  
    dispatch({ type: 'CREATE_TAGS', laneId: laneId, taskId: taskId, tags: tags });
  })
  .catch((resp) => {
    debugger
  })
}

export const deleteTags = (laneId, taskId, tagItems) => (dispatch) => {
  axios.all(tagItems.map((tagItem, index) => axios.delete(
    '/api/v1/tags/' + tagItem.tagId
  )))
  .then((resps) => {
    // Check for any errors, cancel operation if any fails
    for (let i=0; i<resps.length; i++) {
      const resp = resps[i]
      
      if (resp.data.status === 500) {
        throw new Error(resp.data.error)
      }
    }
  
    dispatch({ type: 'DELETE_TAGS', laneId: laneId, taskId: taskId, tagItems: tagItems });
  })
  .catch((resp) => {
    debugger
  })
}