import axios from "axios";

export const retrieveProjectLayout = (projectId) => (dispatch) => {
  return axios.get('/api/v1/projects/' + projectId)
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    return dispatch({ type: 'SET_INITIAL_LAYOUT', data: resp.data.children })
  })
  .catch((resp) => {
    debugger
  })
}

export const resetProjectLayout = () => (dispatch) => {
  return dispatch({ type: 'RESET_PROJECT_LAYOUT' })
}

export const createLane = (projectId, lanePos) => (dispatch, getState) => {
  const layout = getState().projectLayout.data

  return axios.all([
    axios.post(
      '/api/v1/lanes',
      {
        name: 'New Lane',
        pos: lanePos,
        project_id: projectId
      }
    ),
    
    ...layout.filter((lane, index) => lane.pos >= lanePos).map((lane, index) => axios.patch(
      '/api/v1/lanes/' + lane.id,
      {
        pos: lane.pos + 1
      })
    )
  ]) 
  .then((resps) => {
    for (let i=0; i<resps.length; i++) {
      const resp = resps[i]
      if (resp.data.status === 500) {
        throw new Error(resp.data.error)
      } 
    }
    
    return dispatch({ type: 'CREATE_LANE', data: resps[0].data})
  })
  .catch((resp) => {
    debugger
  })
}

export const updateLane = (laneId, data) => (dispatch) => {
  return axios.patch(
    '/api/v1/lanes/' + laneId, 
    data
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    return dispatch({ type: 'UPDATE_LANE', laneId: laneId, data: data })
  })
  .catch((resp) => {
    debugger
  })
}

export const deleteLane = (laneId) => (dispatch, getState) => {
  const layout = getState().projectLayout.data

  const laneToDelete = layout.filter((lane, index) => lane.id == laneId)[0]
  return axios.all([
    axios.delete(
      '/api/v1/lanes/' + laneId
    ),

    ...layout.filter((lane, index) => lane.pos > laneToDelete.pos).map((lane, index) => axios.patch(
      '/api/v1/lanes/' + lane.id,
      {
        pos: lane.pos - 1
      })
    )
  ])
  .then((resps) => {
    for (let i=0; i<resps.length; i++) {
      const resp = resps[i]
      if (resp.data.status === 500) {
        throw new Error(resp.data.error)
      } 
    }
    
    return dispatch({ type: 'DELETE_LANE', laneId: laneId })
  })
  .catch((resp) => {
    debugger
  })
}

export const createTask = (laneId, numTasks) => (dispatch) => {
  return axios.post(
    '/api/v1/tasks',
    {
      name: 'New Task',
      description: 'A Description...',
      pos: numTasks, // always insert at the end
      lane_id: laneId
    }
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    return dispatch({ type: 'CREATE_TASK', laneId: laneId, data: resp.data })
  })
  .catch((resp) => {
    debugger
  })
}

export const updateTask = (laneId, taskId, data, undoable=false) => (dispatch) => {
  return axios.patch(
    '/api/v1/tasks/' + taskId, 
    { task: data }
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    return dispatch({ type: 'UPDATE_TASK', laneId: laneId, taskId: taskId, data: data, undoable: undoable })
  })
  .catch((resp) => {
    debugger
  })
}

export const deleteTask = (laneId, taskId) => (dispatch) => {
  return axios.delete(
    '/api/v1/tasks/' + taskId
  )
  .then((resp) => {
    if (resp.data.status === 500) {
      throw new Error(resp.data.error)
    } 
    
    return dispatch({ type: 'DELETE_TASK', laneId: laneId, taskId: taskId })
  })
  .catch((resp) => {
    debugger
  })
}

export const createTags = (laneId, taskId, temp_tags) => (dispatch) => {
  return axios.all(temp_tags.map((tag, index) => axios.post(
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
  
    return dispatch({ type: 'CREATE_TAGS', laneId: laneId, taskId: taskId, tags: tags })
  })
  .catch((resp) => {
    debugger
  })
}

export const deleteTags = (laneId, taskId, tagItems) => (dispatch) => {
  return axios.all(tagItems.map((tagItem, index) => axios.delete(
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
  
    return dispatch({ type: 'DELETE_TAGS', laneId: laneId, taskId: taskId, tagItems: tagItems })
  })
  .catch((resp) => {
    debugger
  })
}

export const updateTasksPositions = (laneId) => (dispatch, getState) => {
  const layout = getState().projectLayout.data
  const lane = layout.filter((lane, index) => lane.id == laneId)[0]

  const orderedLane = {
    ...lane,
    children: [
      ...lane.children.filter((task, index) => task.starred && !task.completed),
      ...lane.children.filter((task, index) => !task.starred && !task.completed),
      ...lane.children.filter((task, index) => task.completed)
    ]
  }
  orderedLane.children = orderedLane.children.map((task, index) => ({ ...task, pos: index}))

  return axios.all([
    ...orderedLane.children.map((task, index) => axios.patch(
      '/api/v1/tasks/' + task.id,
      {
        pos: index
      }
    ))
  ])
  .then((resps) => {
    // Check for any errors, cancel operation if any fails
    for (let i=0; i<resps.length; i++) {
      const resp = resps[i]
      
      if (resp.data.status === 500) {
        throw new Error(resp.data.error)
      }
    }
  
    return dispatch({ type: 'UPDATE_TASKS_POSITIONS', orderedLane: orderedLane })
  })
  .catch((resp) => {
    debugger
  })
}

// DRAG N DROP ACTIONS

export const moveTaskToLane = (
  splitDropZonePath,
  splitItemPath
) => (dispatch, getState) => {
  const layout = getState().projectLayout.data

  const taskData = layout[splitItemPath[0]].children[splitItemPath[1]]
  const orgLane = layout[splitItemPath[0]]
  const orgPos = splitItemPath[1]
  const destLane = layout[splitDropZonePath[0]]
  const destPos = splitDropZonePath[1]
  return axios.all([
    axios.patch(
      '/api/v1/tasks/' + taskData.id,
      {
        lane_id: destLane.id,
        pos: destPos
      }
    ),
    
    // shift tasks in destination lane down from destination position
    ...destLane.children.filter((task, id) => task.pos >= destPos).map((task, id) => axios.patch(
      '/api/v1/tasks/' + task.id,
      {
        pos: task.pos + 1
      }
    )),

    // shift tasks in original lane up from original position
    ...orgLane.children.filter((task, id) => task.pos > orgPos).map((task, id) => axios.patch(
      '/api/v1/tasks/' + task.id,
      {
        pos: task.pos - 1
      }
    ))
  ])
  .then((resps) => {
    // Check for any errors, cancel operation if any fails
    for (let i=0; i<resps.length; i++) {
      const resp = resps[i]
      
      if (resp.data.status === 500) {
        throw new Error(resp.data.error)
      }
    }
  
    return dispatch({ type: 'MOVE_TASK_TO_LANE', splitDropZonePath, splitItemPath })
  })
  .catch((resp) => {
    debugger
  })
}

export const reorderTaskInLane = (
  splitDropZonePath,
  splitItemPath
) => (dispatch, getState) => {
  const layout = getState().projectLayout.data

  const taskData = layout[splitItemPath[0]].children[splitItemPath[1]]
  const lane = layout[splitItemPath[0]]
  const orgPos = splitItemPath[1]
  const destPos = splitDropZonePath[1]

  const isShiftUp = destPos < orgPos
  return axios.all([
    axios.patch(
      '/api/v1/tasks/' + taskData.id,
      {
        pos: isShiftUp ? destPos : destPos - 1
      }
    ),

    ...lane.children
      .filter((task, id) => isShiftUp ? (task.pos >= destPos && task.pos < orgPos) : (task.pos > orgPos && task.pos < destPos))
      .map((task, id) => axios.patch(
      '/api/v1/tasks/' + task.id,
      {
        pos: task.pos + (isShiftUp ? 1 : -1)
      }
    ))
  ])
  .then((resps) => {
    // Check for any errors, cancel operation if any fails
    for (let i=0; i<resps.length; i++) {
      const resp = resps[i]
      
      if (resp.data.status === 500) {
        throw new Error(resp.data.error)
      }
    }
  
    return dispatch({ type: 'REORDER_TASK_IN_LANE', splitDropZonePath, splitItemPath })
  })
  .catch((resp) => {
    debugger
  })
}

export const reorderLane = (
  splitDropZonePath,
  splitItemPath
) => (dispatch, getState) => {
  const layout = getState().projectLayout.data

  const laneToShift = layout[splitItemPath[0]]
  const orgPos = splitItemPath[0]
  const destPos = splitDropZonePath[0]

  const isShiftUp = destPos < orgPos
  return axios.all([
    axios.patch(
      '/api/v1/lanes/' + laneToShift.id,
      {
        pos: isShiftUp ? destPos : destPos - 1
      }
    ),

    ...layout
      .filter((lane, id) => isShiftUp ? (lane.pos >= destPos && lane.pos < orgPos) : (lane.pos > orgPos && lane.pos < destPos))
      .map((lane, id) => axios.patch(
      '/api/v1/lanes/' + lane.id,
      {
        pos: lane.pos + (isShiftUp ? 1 : -1)
      }
    ))
  ])
  .then((resps) => {
    // Check for any errors, cancel operation if any fails
    for (let i=0; i<resps.length; i++) {
      const resp = resps[i]
      
      if (resp.data.status === 500) {
        throw new Error(resp.data.error)
      }
    }
  
    return dispatch({ type: 'REORDER_LANE', splitDropZonePath, splitItemPath })
  })
  .catch((resp) => {
    debugger
  })
}

export const moveTaskToNewLane = (
  splitDropZonePath,
  splitItemPath,
  projectId
) => (dispatch, getState) => {
  const layout = getState().projectLayout.data

  return dispatch(createLane(projectId, splitDropZonePath[0])).then(resp => { 
    const newLane = resp.data
    const orgLane = layout[splitItemPath[0]]
    const taskToShift = orgLane.children[splitItemPath[1]]
    const destLanePos = splitDropZonePath[0]

    return axios.all([
      axios.patch(
        '/api/v1/tasks/' + taskToShift.id,
        { 
          lane_id: newLane.id,
          pos: 0
        }
      ),

      ...orgLane.children.filter((task, index) => task.pos > taskToShift.pos).map((task, index) => axios.patch(
        '/api/v1/tasks/' + taskToShift.id,
        {
          pos: task.pos - 1
        }
      )),
      
      ...layout.filter((lane, index) => lane.pos >= destLanePos).map((lane, index) => axios.patch(
        '/api/v1/lanes/' + lane.id, 
        {
          pos: lane.pos + 1
        }
      ))
    ])
    .then((resps) => {
      // Check for any errors, cancel operation if any fails
      for (let i=0; i<resps.length; i++) {
        const resp = resps[i]
        
        if (resp.data.status === 500) {
          throw new Error(resp.data.error)
        }
      }
    
      return dispatch({ type: 'MOVE_TASK_TO_NEW_LANE', splitDropZonePath, splitItemPath })
    })
    .catch((resp) => {
      debugger
    })
  })
}