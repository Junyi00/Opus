import React from "react";
import { useDrag } from "react-dnd";

import Tag from "../Tag";

export const EditTag = 'EditTag'

const DraggableTag = (props) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: EditTag,
    item: () => {
      return {
        type: EditTag,
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