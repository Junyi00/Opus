import React from "react";
import { useDrop } from "react-dnd";
import styled from "styled-components";

import { ItemTypes } from "./itemTypes";
import ThrashIcon from "images/Thrash_Icon.png"

const ThrashZone = styled.div`
  width: fit-content;
  height: 100%;

  // border: 1px dotted var(--dark-red);
  border-radius: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
`

const TagThrashZone = ({ onDrop }) => {
  
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.EDIT_TAG],
    drop: (item, monitor) => {
      onDrop(item);
    },
    canDrop: (item, monitor) => {
      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return(
    <ThrashZone ref={drop}><img style={{width: '15px'}} src={ThrashIcon}/></ThrashZone>
  )
}

export default TagThrashZone