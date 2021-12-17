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