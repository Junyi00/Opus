import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./itemTypes";

const DropZone = ({ 
  data, onDrop, isLast, className 
}) => {

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.LANE, ItemTypes.TASK],
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const dropZonePath = data.path
      const splitDropZonePath = dropZonePath.split("-").map((pos, index) => parseInt(pos))
      const itemPath = item.path

      const splitItemPath = itemPath.split("-").map((pos, index) => parseInt(pos))

      // Invalid (Can't drop a parent element (row) into a child (column))
      const parentDropInChild = splitItemPath.length < splitDropZonePath.length
      if (parentDropInChild) return false

      // Current item can't possible move to it's own location
      if (itemPath === dropZonePath) return false

      // Current area
      if (splitItemPath.length === splitDropZonePath.length) {
        const pathToItem = splitItemPath.slice(0, -1).join("-")
        const currentItemIndex = Number(splitItemPath.slice(-1)[0])

        const pathToDropZone = splitDropZonePath.slice(0, -1).join("-")
        const currentDropZoneIndex = Number(splitDropZonePath.slice(-1)[0])

        if (pathToItem === pathToDropZone) {
          const nextDropZoneIndex = currentItemIndex + 1
          if (nextDropZoneIndex === currentDropZoneIndex) return false
        }
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActive = isOver && canDrop;
  return (
    <div
      className={classNames(
        "dropZone",
        { active: isActive, isLast },
        className
      )}
      ref={drop}
    />
  );
};
export default DropZone;
