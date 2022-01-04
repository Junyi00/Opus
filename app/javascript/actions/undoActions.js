import { updateTask } from './projectLayoutActions'

export const undoLastAction = () => (dispatch, getState) => {
  const state = getState().projectLayout

  const last_item = state.past_actions[state.past_actions.length-1]
  const past_action = last_item.action
  const past_data = last_item.data

  switch (past_action.type) {
    case 'UPDATE_TASK':
      const laneId = past_action.laneId
      const taskId = past_action.taskId 

      const prevTaskData = past_data.filter((lane, index) => lane.id == laneId)[0].children.filter((task, index) => task.id == taskId)[0]

      return dispatch(updateTask(laneId, taskId, prevTaskData))

    default:
      console.log(`Undo ${past_action.type} method not implemented`)
  }
}

export const showUndoAlert = () => (dispatch) => {
  return dispatch({ type: 'SHOW_UNDO_ALERT' })
}

export const hideUndoAlert = () => (dispatch) => {
  return dispatch({ type: 'HIDE_UNDO_ALERT' })
}