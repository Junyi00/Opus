import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import styled from "styled-components";

import Tag from "./Tag";
import EditTaskModal from "./Modals/EditTaskModal";

const BaseDiv = styled.div`
  border: 1px solid var(--light-gray);
  ${({ starred }) => starred && `
    border-color: #dbbf1f;
  `}
  border-radius: 5px 5px 0px 0px;

  flex: 1 0 0;
  width: 95%;
  max-width: 300px;
  min-width: 200px;

  min-height: 100px;
  max-height: 100px;
  background-color: white;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const TaskTitle = styled.button`
  width: 100%;
  height: fit-content;
  background-color: var(--light-gray);
  ${({ starred }) => starred && `
    background-color: #dbbf1f;
  `}
  flex: 0 0 0;
  
  padding: 2px;
  padding-left: 5px;
  margin-top: 0px;

  border: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  text-align: left;
`

const TaskContent = styled.div`
  flex: 1 0 0;
  width: 100%;
  padding: 5px;
`

const TagsDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  column-gap: 2px;
`

const Task = (props) => {
  const [showModal, setShowModal] = useState(false)

  const path = props.path
  const taskName = props.data.name
  const taskDesc = props.data.description
  const taskStarred = props.data.starred
  const setTaskModalRes = props.setTaskModalRes

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
    <React.Fragment>
      <BaseDiv ref={ref} starred={taskStarred}>
        <TaskTitle starred={taskStarred} onDoubleClick={()=>setShowModal(true)}>{taskName}</TaskTitle>
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
      <EditTaskModal setModalRes={setTaskModalRes} tags={props.data.tags} taskData={props.data} showModal={showModal} setShowModal={setShowModal}/>
    </React.Fragment>
  )
}

export default Task