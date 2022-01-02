export default (
  state = [],
  action
) => {
  switch (action.type) {
    case 'SET_INITIAL_LAYOUT':
      return action.data
    case 'RESET_PROJECT_LAYOUT':
      return []
    case 'CREATE_LANE':
      {
        const laneToAdd = action.data
        console.log("CREATE REDUCER")
        return [
          ...state.slice(0, laneToAdd.pos),
          laneToAdd,
          ...state.slice(laneToAdd.pos).map((lane, index) => ({ ...lane, pos: lane.pos + 1}))
        ]
      }
    case 'UPDATE_LANE': 
      {
        const laneToUpdate = state.filter((lane, index) => lane.id == action.laneId)[0]
        return [
          ...state.filter((lane, index) => lane.pos < laneToUpdate.pos),
          { ...laneToUpdate,
            ...action.data,
          },
          ...state.filter((lane, index) => lane.pos > laneToUpdate.pos)
        ]
      }
    case 'DELETE_LANE':
      const laneToDelete = state.filter((lane, index) => lane.id == action.laneId)[0]
      return [
        ...state.filter((lane, index) => lane.pos < laneToDelete.pos),
        ...state.filter((lane, index) => lane.pos > laneToDelete.pos).map((lane, index) => ({ ...lane, pos: lane.pos - 1 }))
      ]
    case 'CREATE_TASK':
      {
        const laneToUpdate = state.filter((lane, index) => lane.id == action.laneId)[0]

        return [
          ...state.filter((lane, index) => lane.pos < laneToUpdate.pos),
          { ...laneToUpdate,
            children: [
              ...laneToUpdate.children,
              action.data
            ]
          },
          ...state.filter((lane, index) => lane.pos > laneToUpdate.pos)
        ]
      }
    case 'UPDATE_TASK':
      {
        const laneToUpdate = state.filter((lane, index) => lane.id == action.laneId)[0]
        const taskToUpdate = laneToUpdate.children.filter((task, index) => task.id == action.taskId)[0]
        const updatedTask = {
          ...taskToUpdate,
          ...action.data
        }

        return [
          ...state.filter((lane, index) => lane.pos < laneToUpdate.pos),
          { ...laneToUpdate,
            children: [
              ...laneToUpdate.children.filter((task, index) => task.pos < updatedTask.pos),
              updatedTask,
              ...laneToUpdate.children.filter((task, index) => task.pos > updatedTask.pos)
            ]
          },
          ...state.filter((lane, index) => lane.pos > laneToUpdate.pos)
        ]
      }
    case 'DELETE_TASK':
      {
        const laneToUpdate = state.filter((lane, index) => lane.id == action.laneId)[0]
        const filteredTasks = laneToUpdate.children.filter((task, index) => task.id != action.taskId)

        return [
          ...state.filter((lane, index) => lane.pos < laneToUpdate.pos),
          { ...laneToUpdate,
            children: filteredTasks
          },
          ...state.filter((lane, index) => lane.pos > laneToUpdate.pos)
        ]
      }
    case 'CREATE_TAGS':
      {
        const laneToUpdate = state.filter((lane, index) => lane.id == action.laneId)[0]
        const taskToUpdate = laneToUpdate.children.filter((task, index) => task.id == action.taskId)[0]
        const updatedTask = {
          ...taskToUpdate,
          tags: [
            ...taskToUpdate.tags,
            ...action.tags
          ]
        }

        return [
          ...state.filter((lane, index) => lane.pos < laneToUpdate.pos),
          { ...laneToUpdate,
            children: [
              ...laneToUpdate.children.filter((task, index) => task.pos < updatedTask.pos),
              updatedTask,
              ...laneToUpdate.children.filter((task, index) => task.pos > updatedTask.pos)
            ]
          },
          ...state.filter((lane, index) => lane.pos > laneToUpdate.pos)
        ]
      }
    case 'DELETE_TAGS':
      {
        const laneToUpdate = state.filter((lane, index) => lane.id == action.laneId)[0]
        const taskToUpdate = laneToUpdate.children.filter((task, index) => task.id == action.taskId)[0]
        const updatedTask = {
          ...taskToUpdate,
          tags: taskToUpdate.tags.filter((tag, index) => action.tagItems.filter((removeTag, removeIndex) => removeTag.tagId == tag.id).length == 0)
        } 

        return [
          ...state.filter((lane, index) => lane.pos < laneToUpdate.pos),
          { ...laneToUpdate,
            children: [
              ...laneToUpdate.children.filter((task, index) => task.pos < updatedTask.pos),
              updatedTask,
              ...laneToUpdate.children.filter((task, index) => task.pos > updatedTask.pos)
            ]
          },
          ...state.filter((lane, index) => lane.pos > laneToUpdate.pos)
        ]
      }
    case 'UPDATE_TASKS_POSITIONS':
      {
        const orderedLane = action.orderedLane

        return [
          ...state.filter((lane, index) => lane.pos < orderedLane.pos),
          orderedLane,
          ...state.filter((lane, index) => lane.pos > orderedLane.pos)
        ]
      }
    case 'MOVE_TASK_TO_LANE':
      {
        const splitItemPath = action.splitItemPath
        const splitDropZonePath = action.splitDropZonePath
        const taskData = state[splitItemPath[0]].children[splitItemPath[1]]
        
        const minLaneIndex = Math.min(splitItemPath[0], splitDropZonePath[0])
        const maxLaneIndex = Math.max(splitItemPath[0], splitDropZonePath[0])

        let removedFromLane = state[splitItemPath[0]]
        console.log(removedFromLane)
        // remove task and drop all pos by 1 for those below it
        removedFromLane = {
          ...removedFromLane,
          children: [
            ...removedFromLane.children.slice(0, splitItemPath[1]),
            ...removedFromLane.children.slice(splitItemPath[1]+1).map((task, index) => ({
              ...task,
              pos: task.pos - 1
            }))
          ]
        }

        let addedToLane = state[splitDropZonePath[0]]
        console.log(addedToLane.children.slice(splitDropZonePath[1]))
        addedToLane = {
          ...addedToLane,
          children: [
            ...addedToLane.children.slice(0, splitDropZonePath[1]),
            {
              ...taskData,
              pos: splitDropZonePath[1]
            },
            ...addedToLane.children.slice(splitDropZonePath[1]).map((task, index) => ({
              ...task,
              pos: task.pos + 1
            }))
          ]
        }

        return [
          ...state.slice(0, minLaneIndex),
          splitItemPath[0] < splitDropZonePath[0] ? removedFromLane : addedToLane,
          ...state.slice(minLaneIndex+1, maxLaneIndex),
          splitItemPath[0] < splitDropZonePath[0] ? addedToLane : removedFromLane,
          ...state.slice(maxLaneIndex+1)
        ]
      }
    case 'REORDER_TASK_IN_LANE':
      {
        const splitItemPath = action.splitItemPath
        const splitDropZonePath = action.splitDropZonePath
        
        const lane = state[splitItemPath[0]]
        const taskToShift = lane.children[splitItemPath[1]]
        const orgPos = splitItemPath[1]
        const destPos = splitDropZonePath[1]
        const isShiftUp = destPos < orgPos
        
        return [
            ...state.slice(0, splitItemPath[0]),
            {
              ...lane,
              children: isShiftUp 
                ? [
                  ...lane.children.slice(0, destPos),
                  { ...taskToShift, pos: destPos },
                  ...lane.children.slice(destPos, orgPos).map((task, index) => ({ ...task, pos: task.pos + 1 })),
                  ...lane.children.slice(orgPos + 1)
                ]
                : [
                  ...lane.children.slice(0, orgPos),
                  ...lane.children.slice(orgPos + 1, destPos).map((task, index) => ({ ...task, pos: task.pos - 1 })),
                  { ...taskToShift, pos: destPos - 1 },
                  ...lane.children.slice(destPos)
                ]
            },
            ...state.slice(splitItemPath[0] + 1)
        ]
      }
    case 'REORDER_LANE':
      {
        const splitItemPath = action.splitItemPath
        const splitDropZonePath = action.splitDropZonePath
        
        const laneToShift = state[splitItemPath[0]]
        const orgPos = splitItemPath[0]
        const destPos = splitDropZonePath[0]
        const isShiftUp = destPos < orgPos
        
        return isShiftUp 
          ? [
            ...state.slice(0, destPos),
            { ...laneToShift, pos: destPos },
            ...state.slice(destPos, orgPos).map((lane, index) => ({ ...lane, pos: lane.pos + 1 })),
            ...state.slice(orgPos + 1)
          ]
          : [
            ...state.slice(0, orgPos),
            ...state.slice(orgPos + 1, destPos).map((lane, index) => ({ ...lane, pos: lane.pos - 1 })),
            { ...laneToShift, pos: destPos - 1 },
            ...state.slice(destPos)
          ]
      }
    case 'MOVE_TASK_TO_NEW_LANE':
      {
        console.log("MOVE TASK", state)
        const splitItemPath = action.splitItemPath
        const splitDropZonePath = action.splitDropZonePath
        const orgLaneFromTask = state[splitItemPath[0]]
        const taskToShift = orgLaneFromTask.children[splitItemPath[1]]
        const newLane = state[splitDropZonePath[0]]

        return splitDropZonePath[0] > splitItemPath[0]
          ? [
            ...state.slice(0, splitItemPath[0]),
            {
              ...orgLaneFromTask,
              children: [
                ...orgLaneFromTask.children.slice(0, splitItemPath[1]),
                ...orgLaneFromTask.children.slice(splitItemPath[1] + 1).map((task, index) => ({ ...task, pos: task.pos - 1 }))
              ]
            },
            ...state.slice(splitItemPath[0] + 1, splitDropZonePath[0]),
            {
              ...newLane,
              children: [{ ...taskToShift, pos: 0 }]
            },
            ...state.slice(splitDropZonePath[0] + 1)
          ]
          : [
            ...state.slice(0, splitDropZonePath[0]),
            {
              ...newLane,
              children: [{ ...taskToShift, pos: 0 }]
            },
            ...state.slice(splitDropZonePath[0] + 1, splitItemPath[0]),
            {
              ...orgLaneFromTask,
              children: [
                ...orgLaneFromTask.children.slice(0, splitItemPath[1]),
                ...orgLaneFromTask.children.slice(splitItemPath[1] + 1).map((task, index) => ({ ...task, pos: task.pos - 1 }))
              ]
            },
            ...state.slice(splitItemPath[0] + 1)
          ]
      }
    default:
      return state
  }
};