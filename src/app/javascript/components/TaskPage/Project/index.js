import React, { useCallback } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  createLane,
  moveTaskToLane,
  reorderTaskInLane,
  reorderLane,
  moveTaskToNewLane
} from "../../../actions/projectLayoutActions"

import Lane from "./Lane";
import DropZone from "../DnD/DropZone"
import UndoPopup from "./UndoPopup";

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
  line-height: 15px;
  color: var(--highlight-color);

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover, &:focus {
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

const Project = ({
  searchQuery, projectLayout, projectsState, 
  createLane,
  moveTaskToLane,
  reorderTaskInLane,
  reorderLane,
  moveTaskToNewLane 
}) => {

  const projId = projectsState.projects[projectsState.selectedIndex].id

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
            reorderLane(splitDropZonePath, splitItemPath)
          }
          else { 
            // tasks shifted within lane
            reorderTaskInLane(splitDropZonePath, splitItemPath)
          }
          return;
        }

        // 1.b. Move Task to Existing Lane
        moveTaskToLane(splitDropZonePath, splitItemPath, item)
        return;
      }

      // 2. Move + Create
      moveTaskToNewLane(splitDropZonePath, splitItemPath, projId)
    },
    [projectLayout]
  );

  const addLaneOnClick = () => {
    createLane(projId, projectLayout.length)
  }

  if (projectLayout) {
    if (projectLayout.length > 0) {
      return (
        <React.Fragment>
          <BaseDiv>
            {
              projectLayout
                .map((lane, index) => {
                  const currentPath = `${index}`;

                  return (
                    <React.Fragment key={lane.id}>
                      <DropZone
                        data={{ path: currentPath }}
                        onDrop={handleDrop}
                        path={currentPath}
                        className="horizontalDrag"
                      />
                      {<Lane 
                        key={index} 
                        data={lane} 
                        handleDrop={handleDrop} 
                        path={currentPath} 
                        searchQuery={searchQuery}
                      />}
                    </React.Fragment>
                  );
                })
            }
            <DropZone
              data={{ path: `${projectLayout.length}` }}
              onDrop={handleDrop}
              isLast
              className="horizontalDrag"
            />
            <div style={{height: '100%', width:'20px', position:'relative'}}>
              <NewLaneButton onClick={addLaneOnClick}><a>+</a></NewLaneButton>
            </div>
            
          </BaseDiv>
          <UndoPopup />
        </React.Fragment>
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

export default connect(
  (state) => ({
    projectLayout: state.projectLayout.data,
    projectsState: state.projects
  }),
  (dispatch) => ({
    reorderLane: (...args) => dispatch(reorderLane(...args)),
    reorderTaskInLane: (...args) => dispatch(reorderTaskInLane(...args)),
    moveTaskToLane: (...args) => dispatch(moveTaskToLane(...args)),
    moveTaskToNewLane: (...args) => dispatch(moveTaskToNewLane(...args)),
    createLane: (...args) => dispatch(createLane(...args)),
  })
)(Project)