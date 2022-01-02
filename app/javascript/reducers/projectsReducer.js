export default (
  state = {
    projects: [],
    selectedIndex: null
  },
  action
) => {
  switch (action.type) {
    case 'SET_INITIAL_PROJECTS':
      return {
        ...state,
        projects: action.data
      }
    case 'CREATE_PROJECT':
      return {
        ...state,
        projects: [
          ...state.projects,
          action.data
        ]
      }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: [...state.projects.map((proj, index) => proj.id !== action.projId 
          ? proj 
          : { ...proj, ...action.data })
        ]
      }
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: [
          ...state.projects.filter((proj, index) => proj.id !== action.projId)
        ]
      }

    case 'RESET_SELECTED_PROJECT':
      return {
        ...state,
        selectedIndex: null
      }

    case 'SELECT_PROJECT':
      return {
        ...state,
        selectedIndex: action.selectedIndex
      }
    default:
      return state;
  }
};