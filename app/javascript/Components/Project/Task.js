import React, { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import styled from "styled-components";

import Tag from "./Tag";
import axios from "axios";

const BaseDiv = styled.div`
  border: 1px solid var(--light-gray);
  ${({ starred }) => starred && `
    border-color: #dbbf1f;
  `}
  border-radius: 5px;
  // padding: 5px;
  margin: 5px;

  flex: 1 0 0;
  max-width: 300px;
  min-width: 200px;

  min-height: 100px;
  max-height: 100px;
  background-color: white;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const TaskTitle = styled.div`
  width: 100%;
  height: fit-content;
  background-color: var(--light-gray);
  ${({ starred }) => starred && `
    background-color: #dbbf1f;
  `}
  flex: 0 0 0;
  
  padding: 2px;
  margin-top: 0px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`

const TaskContent = styled.div`
  flex: 1 0 0;
  width: 100%;
  padding: 5px;
`

const Square = styled.div`
  border: 2px solid black;
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

const TagsDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: wrap
`

const Task = (props) => {
  const path = props.path
  const taskName = props.data.name
  const taskDesc = props.data.description
  const taskStarred = props.data.starred

  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: () => {
      return {
        type: ItemTypes.TASK,
        id: props.data.id,
        path: path
    }},
    collect: monitor => ({
        isDragging: monitor.isDragging()
    })
  }), [path]);

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  return (
    <BaseDiv ref={ref} starred={taskStarred}>
      {/* <Square starred={taskStarred}></Square> */}
      {/* <a>{taskName}</a><br /> */}
      <TaskTitle starred={taskStarred}>{taskName}</TaskTitle>
      <TaskContent>
        <TagsDiv>
          {
            props.data.tags.map((tag, index) => 
              <Tag key={index} data={tag}></Tag>
            )
          }
        </TagsDiv>
        <a style={{fontSize: '12px'}}>{taskDesc}</a>
      </TaskContent>
    </BaseDiv>
  )
}

export default Task