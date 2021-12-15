import React from "react";
import styled from "styled-components";

const BaseDiv = styled.div`
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px;

  width: 100%;
  max-width: 300px;

  position: relative;
`

const Square = styled.div`
  border: 2px solid yellow;
  border-radius: 10px;

  width: 10px;
  height: 10px;

  position: absolute;
  left: 100%;
  top: 0%;
  -webkit-transform: translate(-120%, 20%);
  -ms-transform:     translate(-120%, 20%);
  transform:         translate(-120%, 20%);

  ${({ starred }) => starred && `
    background-color: yellow;
  `}
`

const Task = (props) => {

  const data = props.data

  const taskName = data.attributes.name
  const taskDesc = data.attributes.description
  const taskStarred = data.attributes.starred

  return (
    <BaseDiv>
      <Square starred={taskStarred}></Square>
      <a>{taskName}</a><br />
      <a>{taskDesc}</a>
    </BaseDiv>
  )
}

export default Task