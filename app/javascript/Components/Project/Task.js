import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import styled from "styled-components";

import Tag from "./Tag";

const BaseDiv = styled.div`
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;

  width: 100%;
  max-width: 300px;
  background-color: white;

  position: relative;
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

const Task = (props) => {

  const data = props.data

  const path = props.path
  
  const taskName = data.name
  const taskDesc = data.description
  const taskStarred = data.starred

  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: () => {
      return {
        type: ItemTypes.TASK,
        id: data.id,
        children: data.children,
        path: path
    }},
    collect: monitor => ({
        isDragging: monitor.isDragging()
    })
  }), [path]);

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  return (
    <BaseDiv ref={ref}>
      <Square starred={taskStarred}></Square>
      <a>{taskName}</a><br />
      <hr  style={{
        color: '#000000',
        backgroundColor: '#000000',
        height: .1,
        borderColor : '#000000'
      }}/>
      
      <Tag data={{attributes: {name: 'duck'}}}></Tag>
      <a style={{fontSize: '12px'}}>{taskDesc}</a>
    </BaseDiv>
  )
}

export default Task