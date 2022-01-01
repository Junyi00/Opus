export default (
  state = [],
  action
) => {
  switch (action.type) {
    case 'SET_INITIAL':
      return action.data
    case 'CREATE_LANE':
      return [
        ...state,
        action.data
      ]
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
      return state.filter((lane, index) => lane.id != action.laneId)
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
    default:
      return state
  }
};