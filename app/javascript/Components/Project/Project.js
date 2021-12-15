import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Lane from "./Lane";

const LanesDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;

  padding: 10px;

  .column {
    margin: 0 5 px;
  }
`

const Project = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [lanesData, setLanesData] = useState([])

  const projectData = props.project

  useEffect( () => {
    if (projectData) {
      axios.get('/api/v1/project_lanes/' + projectData.id)
        .then( resp => {
          setLanesData(resp.data.data)
          setIsLoading(false)
        })
        .catch( data => {
          debugger
      })
    }
  }, [projectData])

  if (!projectData) {
    return <a>Select a Project!</a>
  }
  else {
    if (!isLoading) {
      const lanes = lanesData
        .sort((lane1, lane2) => lane1.attributes.pos - lane2.attributes.pos)
        .map((lane, index) => <Lane key={index} data={lane}></Lane>)

      return (
        <LanesDiv>
          {lanes}
        </LanesDiv>
      )
    }
    else {
      return (<a>Loading...</a>)
    }

  }
}

export default Project