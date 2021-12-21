import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import styled from "styled-components";

import Tag from "./Tag";
import EditTaskModal from "./Modals/EditTaskModal";

const BaseDiv = styled.div`
  // border: 1px solid black;
  // ${({ starred }) => starred && `
  //   border-color: #dbbf1f;
  // `}
  border-radius: 5px;
  box-shadow: rgba(100, 100, 111, 0.1) 0px 0px 29px 0px;

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

  * {
    font-family: 
  }
`

const TaskHeader = styled.div`
  width: 100%;
  height: fit-content;
  // background-color: var(--light-gray);
  // ${({ starred }) => starred && `
  //   background-color: #dbbf1f;
  // `}
  flex: 0 0 0;
  
  padding: 2px;
  padding-left: 5px;
  margin-top: 0px;

  border: none;
  border-bottom: 1px solid var(--light-gray);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  position: relative;
`

const TaskTitleBtn = styled.div`
  height: 100%;
  width: 100%;
  background-color: transparent;
  border: none

  text-align: left;
`

const CompleteBtn = styled.button`
  background-color: transparent;
  border: 2px solid var(--light-gray);
  border-radius: 10px;

  ${({ starred }) => starred && `
    border-color: #e6c923;
  `}

  position: absolute;
  width: 15px; 
  height: 15px;
  right: 5px;
  top: 50%;

  transform: translate(0%, -50%);
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
  const completeTaskOnClick = props.completeTaskOnClick

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
        <TaskHeader>
          <TaskTitleBtn onDoubleClick={()=> setShowModal(true)}>{taskName}</TaskTitleBtn>
          <CompleteBtn onDoubleClick={() => completeTaskOnClick(props.data.id)} starred={taskStarred}></CompleteBtn>
        </TaskHeader>
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