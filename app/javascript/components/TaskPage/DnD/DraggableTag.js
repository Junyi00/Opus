import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./itemTypes";
import Tag from "../Project/Tag";

const DraggableTag = ({
  index, data
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EDIT_TAG,
    item: () => {
      return {
        type: ItemTypes.EDIT_TAG,
        tagId: data.id,
        index: index
    }},
    collect: monitor => ({
        isDragging: monitor.isDragging()
    })
  }), [index]);

  return (
    <div ref={drag}>
      <Tag data={data}></Tag>
    </div>
  )
}

export default DraggableTag