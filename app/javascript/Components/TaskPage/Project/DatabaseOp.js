import axios from "axios"

export const getCommonTags = () => {
  return axios.get(
    '/api/v1/tags/?count=true'
  ).then(resp => resp)
}