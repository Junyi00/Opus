import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDrag, useDrop } from 'react-dnd';

import { ItemTypes } from "./ItemTypes";
import Task from "./Task";

const BaseDiv = styled.div`
  border-radius: 10px;
  background-color: #e4e9f2;
  border: 1px solid #e4e9f2;
  flex: 1 0 0;
  margin: 5px;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Lane = (props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [tasksData, setTasksData] = useState([])

  const data = props.data
  const id = data.id
  const index = props.index
  const moveLane = props.moveLane

  // Setup Drag n Drop (DnD)
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
      accept: ItemTypes.LANE,
      collect(monitor) {
          return {
              handlerId: monitor.getHandlerId(),
          };
      },
      hover(item, monitor) {
          if (!ref.current) {
              return;
          }
          const dragIndex = item.index;
          const hoverIndex = index;
          // Don't replace items with themselves
          if (dragIndex === hoverIndex) {
              return;
          }
          // Determine rectangle on screen
          const hoverBoundingRect = ref.current?.getBoundingClientRect();
          // Get vertical middle
          const hoverMiddleY = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
          // Determine mouse position
          const clientOffset = monitor.getClientOffset();
          // Get pixels to the top
          const hoverClientY = clientOffset.x - hoverBoundingRect.left;
          // Only perform the move when the mouse has crossed half of the items height
          // When dragging downwards, only move when the cursor is below 50%
          // When dragging upwards, only move when the cursor is above 50%
          // Dragging downwards
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
              return;
          }
          // Dragging upwards
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
              return;
          }
          // Time to actually perform the action
          moveLane(dragIndex, hoverIndex);
          // Note: we're mutating the monitor item here!
          // Generally it's better to avoid mutations,
          // but it's good here for the sake of performance
          // to avoid expensive index searches.
          item.index = hoverIndex;
      },
  });
  const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.LANE,
      item: () => {
          return { id, index };
      },
      collect: (monitor) => ({
          isDragging: monitor.isDragging(),
      }),
  });
  drag(drop(ref));

  // Get Tasks in Lane
  useEffect( () => {
    axios.get('/api/v1/lane_tasks/' + id)
      .then( resp => {
        setTasksData(resp.data.data)
        setIsLoading(false)
      })
      .catch( data => {
        debugger
    })
  }, [])

  return (
    <BaseDiv ref={ref}  data-handler-id={handlerId}>
      <b>{data.attributes.name}</b>
      {
        isLoading
          ? <a>Loading...</a>
          : tasksData.map(
            (task, index) => <Task key={index} data={task}> </Task>
          )
      }
    </BaseDiv>
  )
}

export default Lane