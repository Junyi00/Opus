import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const BaseDiv = styled.div`
  border-radius: 10px;
  background-color: #e4e9f2;
  border: 1px solid #e4e9f2;
  flex: 1 0 0;
  margin: 5px;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
`

const Lane = (props) => {
  // const [data, setData] = useState({})
  // const [isLoading, setIsLoading] = useState(false)

  const data = props.data

  // useEffect( () => {
  //   axios.get('/api/v1/lanes/' + id)
  //   .then( resp => {
  //     debugger
  //     setIsLoading(false)
  //     setData(resp.data.data)
  //   })
  //   .catch( data => {
  //     debugger
  //   })
  // }, [])

  return (
    <BaseDiv>
      <div>
        <b>{data.attributes.name}</b>
      </div>
    </BaseDiv>
  )
}

export default Lane