import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";

import Lane from "./Lane";
import DropZone from "./DnD/DropZone"
import { ItemTypes } from "./DnD/ItemTypes";
import { 
  updateLanesPos, 
  updateTasksPos,
  updateLaneName, 
  updateTask,
  requestNewLane, 
  requestNewTask, 
  requestNewTags,
  deleteLane,
  deleteTask,
  deleteTags 
} from "./DatabaseOp";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveToNewParent,
  favourStarredTasks,
  insert
} from "./DnD/DnDHelpers";

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
  const [projectLayout, setProjectLayout] = useState(null)
  const [toUpdateLaneLayout, setToUpdateLaneLayout] = useState(false)
  const [toUpdateTaskLayout, setToUpdateTaskLayout] = useState(false)

  const [laneModalRes, setLaneModalRes] = useState({})
  const [taskModalRes, setTaskModalRes] = useState({})

  const projectInfo = props.projectInfo
  const projectDataChanged = props.projectDataChanged
  const setProjectDataChanged = props.setProjectDataChanged

  const handleDrop = useCallback(
    (dropZone, item) => {

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type };
      if (item.type === ItemTypes.LANE) {
        newItem.children = item.children;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setProjectLayout(
            handleMoveWithinParent(projectLayout, splitDropZonePath, splitItemPath)
          );
          if (splitItemPath.length === 1) { setToUpdateLaneLayout(true) }
          else { setToUpdateTaskLayout(true) }
          
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setProjectLayout(
          handleMoveToDifferentParent(
            projectLayout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );
        setToUpdateTaskLayout(true)
        return;
      }

      // 3. Move + Create
      handleMoveToNewParent(
        projectLayout,
        splitDropZonePath,
        splitItemPath,
        newItem,
        projectInfo.id
      ).then (newLayout => {
        setProjectLayout(newLayout)
      })
      setToUpdateLayout(true)

    },
    [projectLayout]
  );

  useEffect(() => {
    axios.get('/api/v1/projects/' + projectInfo.id)
    .then( resp => {
      if (projectDataChanged) {
        setProjectLayout(resp.data.children)
        setProjectDataChanged(false)
      }
    })
    .catch( data => {
      debugger
    })
  }, [projectInfo, projectDataChanged])

  // Update Database on Layout Changes (update task / lane positions)
  useEffect(() => {
    if (toUpdateLaneLayout) {
      updateLanesPos(projectLayout)

      setToUpdateLaneLayout(false)
    }
    else if (toUpdateTaskLayout) {
      projectLayout.map((lane, index) => {
        lane = favourStarredTasks(lane)
        updateTasksPos(lane.children)
        return lane
      })

      setToUpdateTaskLayout(false)
    }

  }, [projectLayout, toUpdateTaskLayout, toUpdateLaneLayout])

  // Update Database on Lane Changes
  useEffect(()=> {
    if (Object.keys(laneModalRes).length > 0) {
      if (laneModalRes.toDelete) {
        deleteLane(laneModalRes.laneId).then(resp => {
          setProjectLayout(
            projectLayout.filter((lane, index) => 
              lane.id != laneModalRes.laneId
            )
          )

          // ensure database changes are committed
          setProjectDataChanged(true) 
        })
      }
      else {
        updateLaneName(laneModalRes.laneId, laneModalRes.newName).then(resp => {
          const laneToEdit = projectLayout.filter((lane, index) => 
            lane.id == laneModalRes.laneId
          )[0]
          laneToEdit.name = laneModalRes.newName

          // ensure database changes are committed
          setProjectDataChanged(true) 
        })
      }

      setLaneModalRes({})
    }
  }, [laneModalRes])

  // Update Database on Task Changes
  useEffect(()=> {
    if (Object.keys(taskModalRes).length > 0) {
      if (taskModalRes.toDelete) {
        deleteTask(taskModalRes.taskId).then(resp => {
          // ensure database changes are committed
          setProjectDataChanged(true)
        })
      }
      else {
        updateTask(taskModalRes.taskId, taskModalRes.data).then(resp => {
          requestNewTags(taskModalRes.tagsToAdd).then(resp => {
            deleteTags(taskModalRes.tagsToDelete.map((tag, index) => tag.tagId)).then(resp => {
              // ensure database changes are committed
              setProjectDataChanged(true)
            })
          })
        })
      } 

      setLaneModalRes({})
    }
  }, [taskModalRes])

  const addLaneOnClick = () => {
    requestNewLane(projectInfo.id).then(resp => {
      const newLane = resp.data
      setProjectLayout(insert(projectLayout, projectLayout.length, newLane))
      setToUpdateLaneLayout(true) // position of lanes needs to be updated
    })
  }

  const addTaskOnClick = (lane_id) => () => {
    requestNewTask(lane_id).then(resp => {
      const newTask = resp.data

      const lane = projectLayout.filter((lane, index) => lane.id == lane_id)[0]
      lane.children = insert(lane.children, lane.children.length, newTask)

      setToUpdateTaskLayout(true) // position of tasks needs to be updated
    })
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
                      addTaskOnClick={addTaskOnClick(lane.id)}
                      completeTaskOnClick={completeTaskOnClick}
                      setLaneModalRes={setLaneModalRes}
                      setTaskModalRes={setTaskModalRes}
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