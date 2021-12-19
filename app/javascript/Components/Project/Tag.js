import React from "react";
import styled from "styled-components";

const BaseDiv = styled.div`
  border: 1px solid green;
  border-radius: 5px;
  background-color: green;

  width: fit-content;
  height: 20px;
  padding: 0px 2px 0px 2px;
  
  align-text: center;
  font-size: 12px;
  line-height: 20px;
`

const Tag = (props) => {

  const data = props.data

  return (
    <BaseDiv>
      <a>{data.name.toUpperCase()}</a>
    </BaseDiv>
  )
}

export default Tag