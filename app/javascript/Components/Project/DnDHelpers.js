// import shortid from "shortid";
import { ItemTypes } from "./ItemTypes";
import { requestNewLane, moveTaskToLane } from "./DatabaseOp"

// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(
    startIndex > endIndex ? endIndex : Math.max(endIndex-1, 0), 
    0, 
    removed
  ); // inserting task in new index

  return result;
};

export const remove = (arr, index) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // part of the array after the specified index
  ...arr.slice(index + 1)
];

export const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
];

export const reorderChildren = (children, splitDropZonePath, splitItemPath) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    const itemIndex = Number(splitItemPath[0]);
    const res =  reorder(children, itemIndex, dropZoneIndex);

    return res
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitDropZoneChildrenPath = splitDropZonePath.slice(1);
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: reorderChildren(
      nodeChildren.children,
      splitDropZoneChildrenPath,
      splitItemChildrenPath
    )
  };

  return updatedChildren;
};

export const removeChildFromChildren = (children, splitItemPath) => {
  if (splitItemPath.length === 1) {
		const itemIndex = Number(splitItemPath[0]);
		// console.log([children[itemIndex], remove(children, itemIndex)])
		return [children[itemIndex], remove(children, itemIndex)];
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitItemPath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
	
	const [removed, updated] = removeChildFromChildren(
		nodeChildren.children,
		splitItemChildrenPath
	)

  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: updated
  };

  return [removed, updatedChildren];
};

export const addChildToChildren = (children, splitDropZonePath, item) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    return insert(children, dropZoneIndex, item);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: addChildToChildren(
      nodeChildren.children,
      splitItemChildrenPath,
      item
    )
  };

  return updatedChildren;
};

export const handleMoveWithinParent = (
  layout,
  splitDropZonePath,
  splitItemPath
) => {
  return reorderChildren(layout, splitDropZonePath, splitItemPath);
};

export const handleMoveToDifferentParent = (
  layout,
  splitDropZonePath,
  splitItemPath,
  item
) => {
  let newLayoutStructure = null;

	const updatedLayout = layout
  let [removed, updatedLayout1] = removeChildFromChildren(updatedLayout, splitItemPath);
  updatedLayout1 = addChildToChildren(
    updatedLayout1,
    splitDropZonePath,
    newLayoutStructure ? newLayoutStructure : removed
  );
  
  moveTaskToLane(removed.id, layout[Number(splitDropZonePath[0])].id)

  return updatedLayout1;
};

export const handleMoveToNewParent = (
  layout,
  splitDropZonePath,
  splitItemPath,
  item,
  project_id
) => {
  let newLayoutStructure = null

  return requestNewLane(project_id)
    .then (resp => {
      const updatedLayout = layout
      let [removed, updatedLayout1] = removeChildFromChildren(updatedLayout, splitItemPath);
      // updatedLayout = handleAddColumDataToRow(updatedLayout); // fill in empty data when a new row is created

      switch (splitDropZonePath.length) {
        case 1: { // into Project
          // moving column outside into new row made on the fly
          if (item.type === ItemTypes.TASK) {

            newLayoutStructure = {
              ...resp.data,
              children: [removed]
            };
          }
          break;
        }
      }

      updatedLayout1 = addChildToChildren(
        updatedLayout1,
        splitDropZonePath,
        newLayoutStructure ? newLayoutStructure : removed
      );

      return updatedLayout1;
    })
    .catch(data => {
      debugger
    })
	
};

export const handleRemoveItemFromLayout = (layout, splitItemPath) => {
  return removeChildFromChildren(layout, splitItemPath);
};

export const favourStarredTasks = (laneLayout) => {
  laneLayout.children = laneLayout.children.sort((task1, task2) => {
    if ((task1.starred && !task2.starred) || (task2.starred && !task1.starred)) {
      return task1.starred ? -1 : 1
    }
    return 0
  })

  return laneLayout
}