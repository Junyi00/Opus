import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDrag, useDrop } from 'react-dnd';

import { ItemTypes } from "./ItemTypes";
import DropZone from "./DropZone";
import Task from "./Task";

const BaseDiv = styled.div`
  // border-radius: 10px;
  // background-color: #e4e9f2;
  border: 1px solid lightgray;
  flex: 1 0 0;
  min-width: 250px;
  margin: 5px;
  
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Lane = (props) => {

  const data = props.data
  const path = props.path
  const handleDrop = props.handleDrop

  const ref = useRef(null)

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
  drag(ref);

  return (
    <BaseDiv ref={ref}>
      <b>{data.name}</b>
      <div id='laneDiv' style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {
            data.children.map((task, index) => {
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
                  {<Task key={task.id} data={task} handleDrop={handleDrop} path={currentPath}/>}
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
      </div>
    </BaseDiv>
  )
}

export default Lane