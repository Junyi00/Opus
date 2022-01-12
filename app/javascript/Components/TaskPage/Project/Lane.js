import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDrag } from 'react-dnd';
import { connect } from "react-redux";

import { ItemTypes } from "../DnD/itemTypes";
import DropZone from "../DnD/DropZone";
import Task from "./Task";
import EditLaneModal from "../Modals/EditLaneModal";
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
    transition: 150ms all;
  }
`

const LaneHeaderBtn = styled.button`
  width: 100%;
  background-color: transparent;
  border: none;
`

const Lane = ({
  path, data, handleDrop, searchQuery, createTask
}) => {
  const [showModal, setShowModal] = useState(false)
  const [childrenToDisplay, setChildrenToDisplay] = useState([])

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
    if (searchQuery == '') { return }

    if (searchQuery.charAt(0) == '#') {
      // tag filter
      setChildrenToDisplay(
        data.children.filter((task, index) => 
          task.tags.filter((tag, index) => tag.name.toLowerCase().includes(searchQuery.slice(1).toLowerCase())).length > 0
        )
      )
    }
    else {
      // title filter
      setChildrenToDisplay(data.children.filter((task, index) => task.name.toLowerCase().includes(searchQuery.toLowerCase())))
    }
  }, [searchQuery])

  const addTaskOnClick = () => {
    createTask(data.id , data.children.filter((task, index) => !task.completed).length)
  }

  return (
    <React.Fragment>
      { searchQuery == ''
        ? <BaseDiv ref={drag}>
            <LaneHeaderBtn onDoubleClick={() => setShowModal(true)}><b>{data.name}</b></LaneHeaderBtn>
            <LaneContentDiv
              onTouchStart={(e)=>{if (e.target.className.includes('dropZone')) { e.stopPropagation(); }}} // allow touch scrolling without affecting drag n drop touch interactions
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
              <div style={{flex:'1 0 0', width: '100%', position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
                <DropZone
                    data={{ path: `${path}-${data.children.filter((task, index) => !task.completed).length}` }}
                    onDrop={handleDrop}
                    isLast
                />
                <div style={{position:'absolute', left:'0px', top:'35px', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  <NewTaskBtn onClick={addTaskOnClick}>+</NewTaskBtn>
                </div>
              </div>
            </LaneContentDiv>
          </BaseDiv>
        
        : <BaseDiv> 
            <LaneHeaderBtn onDoubleClick={() => setShowModal(true)}><b>{data.name}</b></LaneHeaderBtn>
            <LaneContentDiv>
              <div style={{minHeight:'35px', maxHeight:'35px'}} />
              {
                childrenToDisplay.map((task, index) => {
                  const currentPath = `${path}-${index}`;
                  return (
                    <React.Fragment key={task.id}>
                      <Task key={task.id} laneId={data.id} data={task} handleDrop={handleDrop} path={currentPath} />
                      <div style={{minHeight:'35px', maxHeight:'35px'}} />
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

export default connect(
  null,
  (dispatch) => ({
    createTask: (...args) => dispatch(createTask(...args))
  })
)(Lane)