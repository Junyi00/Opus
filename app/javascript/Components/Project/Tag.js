import React from "react";
import styled from "styled-components";

const BaseDiv = styled.div`
  border: 1px solid ${props => props.color};
  border-radius: 5px;

  background-color: ${props => props.color};

  width: fit-content;
  height: 20px;
  padding: 0px 2px 0px 2px;
  
  font-size: 12px;
  line-height: 20px;
  // text-align: center;
`

const Tag = (props) => {

  const data = props.data

  return (
    <BaseDiv color={data.color}>
      {data.name.toUpperCase()}
    </BaseDiv>
  )
}

export default Tag