import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDrag } from 'react-dnd';
import { useDispatch } from "react-redux";

import { ItemTypes } from "./DnD/ItemTypes";
import DropZone from "./DnD/DropZone";
import Task from "./Task";
import EditLaneModal from "./Modals/EditLaneModal";
import { createTask } from "../../../actions/projectLayoutActions";

const BaseDiv = styled.div`
  border-radius: var(--standard-br);
  background-color: var(--bg-gray);
  // border: 1px solid var(--light-gray);
  flex: 1 0 0;
  min-width: 250px;
  margin: 5px;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: inherit;
`

const LaneContentDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex; 
  flex-direction: column;
  align-items: center;
  row-gap: 5px;

  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`

const NewTaskBtn = styled.button`
  background-color: transparent;
  border: 1px solid var(--highlight-color);
  border-radius: 10px;

  height: 20px;
  width: 20px;
  font-size: 20px;
  line-height: 20px;
  color: var(--highlight-color);

  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    width: 100%;
    transition: 150ms width;
  }
  
  ${({ emptyDiv }) => emptyDiv && `
    width: 40px;
    height: 40px;

    &:hover {
      border-radius: 30px;
    }
  `}
`

const LaneHeaderBtn = styled.button`
  background-color: transparent;
  border: none;
`

const Lane = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [childrenToDisplay, setChildrenToDisplay] = useState([])

  const data = props.data
  const path = props.path
  const handleDrop = props.handleDrop

  const dispatch = useDispatch()

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.LANE,
    item: () => {
      return {
        type: ItemTypes.LANE,
        id: data.id,
        children: data.children,
        path: path
    }},
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  }), [path]);

  const opacity = isDragging ? 0 : 1;

  useEffect(()=> {
    if (props.searchQuery == '') { return }

    if (props.searchQuery.charAt(0) == '#') {
      // tag filter
      setChildrenToDisplay(
        data.children.filter((task, index) => 
          task.tags.filter((tag, index) => tag.name.toLowerCase().includes(props.searchQuery.slice(1).toLowerCase())).length > 0
        )
      )
    }
    else {
      // title filter
      setChildrenToDisplay(data.children.filter((task, index) => task.name.toLowerCase().includes(props.searchQuery.toLowerCase())))
    }
  }, [props.searchQuery])

  const addTaskOnClick = () => {
    dispatch(createTask(data.id , data.children.length))
  }

  return (
    <React.Fragment>
      { props.searchQuery == ''
        ? <BaseDiv ref={drag}>
            <LaneHeaderBtn onDoubleClick={() => setShowModal(true)}><b>{data.name}</b></LaneHeaderBtn>
            <LaneContentDiv
              onTouchStart={(e)=>{if (e.target.className == 'dropZone') { e.stopPropagation(); }}} // allow touch scrolling without affecting drag n drop touch interactions
            >
              {
                data.children
                  .filter((task, index) => !task.completed)
                  .map((task, index) => {
                    const currentPath = `${path}-${index}`;
                    return (
                      <React.Fragment key={task.id}>
                        <DropZone
                          data={{ path: currentPath }}
                          onDrop={handleDrop}
                        />
                        <Task key={task.id} laneId={data.id} data={task} handleDrop={handleDrop} path={currentPath} />
                      </React.Fragment>
                    )
                })
              }
              <DropZone
                  data={{ path: `${path}-${data.children.filter((task, index) => !task.completed).length}` }}
                  onDrop={handleDrop}
                  isLast
              />
              <NewTaskBtn onClick={addTaskOnClick}>+</NewTaskBtn>
            </LaneContentDiv>
          </BaseDiv>
        
        : <BaseDiv> 
            <LaneHeaderBtn onDoubleClick={() => setShowModal(true)}><b>{data.name}</b></LaneHeaderBtn>
            <LaneContentDiv>
              <div style={{minHeight:'40px', maxHeight:'40px'}} />
              {
                childrenToDisplay.map((task, index) => {
                  const currentPath = `${path}-${index}`;
                  return (
                    <React.Fragment key={task.id}>
                      <Task key={task.id} laneId={data.id} data={task} handleDrop={handleDrop} path={currentPath} />
                      <div style={{minHeight:'40px', maxHeight:'40px'}} />
                    </React.Fragment>
                  )
                })
              }
            </LaneContentDiv>
          </BaseDiv>
      }
      <EditLaneModal showModal={showModal} setShowModal={setShowModal} laneName={data.name} laneId={data.id}/>
    </React.Fragment> 
  )
}

export default Lane