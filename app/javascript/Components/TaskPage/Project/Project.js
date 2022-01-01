import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import Lane from "./Lane";
import DropZone from "./DnD/DropZone"
import { 
  updateLanesPos, 
  updateTasksPos,
  updateTask,
} from "./DatabaseOp";
import {
  retrieveProject,
  createLane,
  moveTaskToLane,
  reorderTaskInLane,
  reorderLane,
  moveTaskToNewLane
} from "../../../actions/projectActions"

const BaseDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: none;
  // justify-content: space-evenly;

  position: absolute;
  top: 0px;
  bottom: 0px;
  padding: 10px 10px 0px 10px;
`

const NewLaneButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  height: 20px;
  width: 20px;
  transform: translate(-50%, -50%);
  line-height: 20px;
  
  background-color: transparent;
  border: 1px solid var(--highlight-color);
  border-radius: var(--standard-br);
  margin-left: 5px;

  font-size: 20px;
  color: var(--highlight-color);

  &:hover {
    height: 100%;
    transition: 150ms height;
  }
`

const EmptyNewLaneBtn = styled.button`
  background-color: transparent;
  border: none;
  // border-radius: 10px;

  width: 15px;
  height: 15px;
  line-height: 15px;
  text-align: center;

  // font-size: 15px;
  color: var(--highlight-color);

  &:hover {
    border-radius: 15px;
    border: 1px solid var(--highlight-color);
    transition: 150ms all;
  }
`

const EmptyBaseDiv = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Project = (props) => {
  // const [projectLayout, setProjectLayout] = useState(null)
  const [toUpdateLaneLayout, setToUpdateLaneLayout] = useState(false)
  const [toUpdateTaskLayout, setToUpdateTaskLayout] = useState(false)

  const projectInfo = props.projectInfo
  const setProjectDataChanged = props.setProjectDataChanged

  const dispatch = useDispatch()
  const projectLayout = useSelector((state) => state.project)

  const handleDrop = useCallback(
    (dropZone, item) => {

      const splitDropZonePath = dropZone.path.split("-").map((pos, index) => parseInt(pos))
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-")

      const splitItemPath = item.path.split("-").map((pos, index) => parseInt(pos))
      const pathToItem = splitItemPath.slice(0, -1).join("-")

      // 1. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 1.a. move within parent
        if (pathToItem === pathToDropZone) {
          if (splitItemPath.length == 1) { 
            // lanes shifted around
            dispatch(reorderLane(splitDropZonePath, splitItemPath))
          }
          else { 
            // tasks shifted within lane
            dispatch(reorderTaskInLane(splitDropZonePath, splitItemPath))
          }
          return;
        }

        // 1.b. Move Task to Existing Lane
        dispatch(moveTaskToLane(splitDropZonePath, splitItemPath, item))
        return;
      }

      // 2. Move + Create
      dispatch(moveTaskToNewLane(splitDropZonePath, splitItemPath, projectInfo.id))
    },
    [projectLayout]
  );

  // A different project selected on the sidebar
  useEffect(() => {
    dispatch(retrieveProject(projectInfo.id))
  }, [projectInfo])

  const addLaneOnClick = () => {
    dispatch(createLane(projectInfo.id, projectLayout.length))
  }

  const completeTaskOnClick = (task_id) => {
    updateTask(task_id, {
      completed: true
    }).then(resp => {
      setProjectDataChanged(true)
    })
  }

  if (projectLayout) {

    if (projectLayout.length > 0) {
      return (
        <BaseDiv>
          {
            projectLayout
              .map((lane, index) => {
                const currentPath = `${index}`;

                return (
                  <React.Fragment key={lane.id}>
                    <DropZone
                      data={{
                        path: currentPath,
                        childrenCount: projectLayout.length
                      }}
                      onDrop={handleDrop}
                      path={currentPath}
                      className="horizontalDrag"
                    />
                    {<Lane 
                      key={index} 
                      data={lane} 
                      handleDrop={handleDrop} 
                      path={currentPath} 
                      searchQuery={props.searchQuery}
                      completeTaskOnClick={completeTaskOnClick}
                    />}
                  </React.Fragment>
                );
              })
          }
          <DropZone
            data={{
              path: `${projectLayout.length}`,
              childrenCount: projectLayout.length
            }}
            onDrop={handleDrop}
            isLast
            className="horizontalDrag"
          />
          <div style={{height: '100%', width:'20px', position:'relative'}}>
            <NewLaneButton onClick={addLaneOnClick}>+</NewLaneButton>
          </div>
          
        </BaseDiv>
      )
    }
    else {
      return (
        <EmptyBaseDiv>
          <EmptyNewLaneBtn onClick={addLaneOnClick}>+</EmptyNewLaneBtn>
          <a style={{color: 'var(--highlight-color)'}}>Add a Lane!</a>
        </EmptyBaseDiv>
      )
    }
    
  }
  else {
    return (<div style={{textAlign: 'center', width: '100%', marginTop: '10px'}}>Loading...</div>)
  }

}

export default Project