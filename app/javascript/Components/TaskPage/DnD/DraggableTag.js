import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./itemTypes";
import Tag from "../Project/Tag";

const DraggableTag = (props) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EDIT_TAG,
    item: () => {
      return {
        type: ItemTypes.EDIT_TAG,
        tagId: props.data.id,
        index: props.index
    }},
    collect: monitor => ({
        isDragging: monitor.isDragging()
    })
  }), [props.index]);

  return (
    <div ref={drag}>
      <Tag data={props.data}></Tag>
    </div>
  )
}

export default DraggableTag