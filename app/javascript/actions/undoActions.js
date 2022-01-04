import { updateTask } from './projectLayoutActions'

export const undo = () => (dispatch, getState) => {
  const state = getState().projectLayout

  const [ past_action, past_data ] = state.past_actions[state.past_actions.length-1]

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