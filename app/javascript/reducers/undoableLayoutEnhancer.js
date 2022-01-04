export default function undoableLayoutEnhancer(reducer, max_past=1) {
  const initialState = {
    past_actions: [],
    data: reducer(undefined, {}),
  }

  return (state = initialState, action) => {
    const nextData = reducer(state.data, action)

    if (nextData == state.data) {
      return state
    }

    const new_past_actions = [...state.past_actions]
    if (action.undoable) { 
      new_past_actions.push({ action: action, data: state.data }) 
    }
    return {
      past_actions: new_past_actions.splice(-1 * max_past),
      data: nextData
    }
  }
}