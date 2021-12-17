import axios from "axios"

export const requestNewLane = (project_id) => {
  return axios.post(
    '/api/v1/lanes',
    {
      name: 'New Lane',
      project_id: project_id
    }
  ).then(resp => resp)
}

export const requestNewProject = () => {
  return axios.post(
    '/api/v1/projects',
    {
      name: 'New Project',
      user_id: 1
    }
  ).then(resp => resp)
}

export const updateLanesPos = (projectLayout) => {
  projectLayout.map((lane, index) => {
    axios.patch('/api/v1/lanes/' + lane.id, {
      pos: index
    })
    .catch(data => {
      debugger
    })
  })
}

export const updateTasksPos = (laneLayout) => {
  laneLayout.map((task, index) => {
    axios.patch('/api/v1/tasks/' + task.id, {
      pos: index
    })
    .catch(data => {
      debugger
    })
  })
}

export const moveTaskToLane = (task_id, new_lane_id) => {
  return axios.patch(
    '/api/v1/tasks/' + task_id,
    {
      lane_id: new_lane_id
    }
  ).then(resp => resp)
}