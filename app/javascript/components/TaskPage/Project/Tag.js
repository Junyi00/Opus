import React from "react";
import styled from "styled-components";

const BaseDiv = styled.div`
  border: 1px solid ${props => props.color};
  border-radius: 5px;

  background-color: ${props => props.color};

  width: fit-content;
  height: 16px;
  padding: 0px 2px 0px 2px;
  
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 12px;
`

const Tag = ({data}) => {

  return (
    <BaseDiv color={data.color}>
      {data.name.toUpperCase()}
    </BaseDiv>
  )
}

export default Tag