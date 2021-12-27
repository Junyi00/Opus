import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDrag} from 'react-dnd';

import { ItemTypes } from "./DnD/ItemTypes";
import DropZone from "./DnD/DropZone";
import Task from "./Task";
import EditLaneModal from "./Modals/EditLaneModal";

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
`

const NewTaskBtn = styled.button`
  background-color: transparent;
  border: 1px solid var(--highlight-color);
  border-radius: 10px;
  margin-top: 5px;

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
  const addTaskOnClick = props.addTaskOnClick
  const setLaneModalRes = props.setLaneModalRes
  const setTaskModalRes = props.setTaskModalRes

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
          task.tags.filter((tag, index) => tag.name.toLowerCase() == props.searchQuery.slice(1).toLowerCase()).length > 0
        )
      )
    }
    else {
      // title filter
      setChildrenToDisplay(data.children.filter((task, index) => task.name.toLowerCase().includes(props.searchQuery.toLowerCase())))
    }
  }, [props.searchQuery])


  return (
    <React.Fragment>
      { props.searchQuery == ''
        ? <BaseDiv ref={drag}>
            <LaneHeaderBtn onDoubleClick={() => setShowModal(true)}><b>{data.name}</b></LaneHeaderBtn>
            <div id='laneDiv' style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {
                  data.children
                    .filter((task, index) => !task.completed)
                    .map((task, index) => {
                      const currentPath = `${path}-${index}`;
                      return (
                        <React.Fragment key={task.id}>
                          <DropZone
                            data={{
                              path: currentPath,
                              childrenCount: data.children.length,
                            }}
                            onDrop={handleDrop}
                          />
                          {<Task key={task.id} data={task} handleDrop={handleDrop} path={currentPath} setTaskModalRes={setTaskModalRes} completeTaskOnClick={props.completeTaskOnClick}/>}
                        </React.Fragment>
                      )
                  })
                }
                <DropZone
                    data={{
                        path: `${path}-${data.children.length}`,
                        childrenCount: data.children.length,
                    }}
                    onDrop={handleDrop}
                    isLast
                />
                <NewTaskBtn onClick={addTaskOnClick}>+</NewTaskBtn>
            </div>
          </BaseDiv>
        
        : <BaseDiv>
            <LaneHeaderBtn onDoubleClick={() => setShowModal(true)}><b>{data.name}</b></LaneHeaderBtn>
            <div id='laneDiv' style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{height:'40px'}}></div>
              {
                childrenToDisplay.map((task, index) => {
                  const currentPath = `${path}-${index}`;
                  return (
                    <React.Fragment key={task.id}>
                      {<Task key={task.id} data={task} handleDrop={handleDrop} path={currentPath} setTaskModalRes={setTaskModalRes} completeTaskOnClick={props.completeTaskOnClick}/>}
                      <div style={{height:'40px'}}></div>
                    </React.Fragment>
                  )
                })
              }
            </div>
          </BaseDiv>
      }
      <EditLaneModal showModal={showModal} setShowModal={setShowModal} setModalRes={setLaneModalRes} laneName={data.name} laneId={data.id}/>
    </React.Fragment> 
  )
}

export default Lane