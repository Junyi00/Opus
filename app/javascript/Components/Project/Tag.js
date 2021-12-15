import React from "react";
import styled from "styled-components";

const BaseDiv = styled.div`
  border: 1px solid green;
  border-radius: 5px;
  background-color: green;

  width: fit-content;
  padding: 1px;
`

const Tag = (props) => {

  const data = props.data

  return (
    <BaseDiv>
      <i>#{data.attributes.name}</i>
    </BaseDiv>
  )
}

export default Tag