import axios from "axios"

// INDIVIDUAL PROJECT OPERATIONS

export const getCommonTags = () => {
  return axios.get(
    '/api/v1/tags/?count=true'
  ).then(resp => resp)
}