export default function undoableLayoutEnhancer(reducer, max_past=1) {
  const initialState = {
    past_actions: [],
    data: reducer(undefined, {}),
    show_alert: false,
  }

  return (state = initialState, action) => {

    switch (action.type) {
      case 'SHOW_UNDO_ALERT':
        return {
          ...state,
          show_alert: true
        }

      case 'HIDE_UNDO_ALERT':
        return {
          ...state,
          show_alert: false
        }

      default: 
        const nextData = reducer(state.data, action)

        if (nextData == state.data) {
          return state
        }
        
        // all actions with 'undoable' defined (boolean), is either an undo action or not. Undo actions will have the last past action removed
        const new_past_actions = [...state.past_actions]
        if (action.undoable) { 
          new_past_actions.push({ action: action, data: state.data }) 
        }
        else if (action.undoable == false) {
          new_past_actions.pop()
        }

        return {
          past_actions: new_past_actions.splice(-1 * max_past),
          data: nextData
        }
    }
  }
}