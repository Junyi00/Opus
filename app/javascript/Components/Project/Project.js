import React, { useEffect, useState, useCallback, forceUpdate } from "react";
import styled from "styled-components";
import axios from "axios";
import update from 'immutability-helper';

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
  const [errorUpdating, setErrorUpdating] = useState(false)

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

  const moveLane = useCallback((dragIndex, hoverIndex) => {
    const dragLane = lanesData[dragIndex]
    const hoverLane = lanesData[hoverIndex]
    const reordered = update(lanesData, {
      $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragLane],
      ],
    })

    const dragPos = dragLane.attributes.pos

    axios.patch('/api/v1/lanes/' + dragLane.id, {
      pos: hoverLane.attributes.pos
    })
      .catch(()=> {setErrorUpdating(true)})
    
    axios.patch('/api/v1/lanes/' + hoverLane.id, {
      pos: dragPos
    })
      .catch(()=> {setErrorUpdating(true)}) // TODO: Does not trigger on first error

    if (!errorUpdating) { 
      dragLane.attributes.pos = hoverLane.attributes.pos
      hoverLane.attributes.pos = dragPos
      setLanesData(reordered) 
    }
    else {
      debugger // Inform user to refresh
    }
  }, [lanesData])

  if (!projectData) {
    return <a>Select a Project!</a>
  }
  else {
    if (!isLoading) {
      console.log('rendering')
      console.log(lanesData)
      const lanes = lanesData
        .sort((lane1, lane2) => lane1.attributes.pos - lane2.attributes.pos)
        .map((lane, index) => <Lane key={index} index={index} data={lane} moveLane={moveLane}> </Lane>)

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