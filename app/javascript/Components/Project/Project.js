import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";

import Lane from "./Lane";
import DropZone from "./DropZone"
import { ItemTypes } from "./ItemTypes";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout
} from "./DnDHelpers";

const BaseDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;

  padding: 10px;

  .column {
    margin: 0 5 px;
  }
`

const Project = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [projectLayout, setProjectLayout] = useState(null)
  const [toUpdateLayout, setToUpdateLayout] = useState(false)

  const projectInfo = props.projectInfo

  useEffect(()=> console.log(projectLayout), [projectLayout])

  const handleDrop = useCallback(
    (dropZone, item) => {
      // console.log("dropZone", dropZone);
      // console.log("item", item);

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
          setToUpdateLayout(true)
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
        setToUpdateLayout(true)
        return;
      }

      // 3. Move + Create
      setProjectLayout(
        handleMoveToDifferentParent(
          projectLayout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      );
      setToUpdateLayout(true)

    },
    [projectLayout]
  );
  
  useEffect(() => {
    axios.get('/api/v1/projects/' + projectInfo.id)
    .then( resp => {
      setProjectLayout(
        resp.data.children.sort((lane1, lane2) => lane1.pos - lane2.pos)
      )
      setIsLoading(false)
    })
    .catch( data => {
      debugger
    })
  }, [projectInfo])

  // Update Database on Layout Changes
  useEffect(() => {
    if (toUpdateLayout) {
      projectLayout.map((lane, index) => {
        axios.patch('/api/v1/lanes/' + lane.id, {
          pos: index
        })
        .catch(data => {
          debugger
        })
      })

      setToUpdateLayout(false)
    }

  }, [toUpdateLayout])

  if (projectLayout) {

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
                    {<Lane key={index} data={lane} handleDrop={handleDrop} path={currentPath}> </Lane>}
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
      </BaseDiv>
    )
  }
  else {
    return (<a>Loading...</a>)
  }

}

export default Project