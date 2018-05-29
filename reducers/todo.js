const pre = '@todo-concore/todo'

const FETCH_TODOS = `${pre}/FETCH_TODOS`
const RECEIVE_TODOS = `${pre}/RECEIVE_TODOS`
const FETCH_FAILED = `${pre}/FETCH_FAILED`
const TOGGLE_CREATE_DIALOG = `${pre}/TOGGLE_CREATE_DIALOG`
const CREATE_TASK = `${pre}/CREATE_TASK`
const EDIT_TASK = `${pre}/EDIT_TASK`
const EDIT_ERROR = `${pre}/EDIT_ERROR`

export const todoActions = {
  fetch: () => ({
    type: FETCH_TODOS
  }),
  receiveTodos: todos => ({
    type: RECEIVE_TODOS,
    todos
  }),
  fetchFailed: error => ({
    type: FETCH_FAILED,
    error
  }),
  toggleCreateDialog: show => ({
    type: TOGGLE_CREATE_DIALOG,
    show
  }),
  createTask: task => ({
    type: CREATE_TASK,
    task
  }),
  edit: task => ({
    type: EDIT_TASK,
    task
  }),
  editError: (taskId, error) => ({
    type: EDIT_ERROR,
    taskId,
    error
  })
}

export const defaultState = {
  todos: null,
  isFetching: false,
  fetchError: null,
  showCreateDialog: false
}

export const todoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_TODOS: {
      return {
        ...state,
        fetchError: null,
        isFetching: true
      }
    }
    case RECEIVE_TODOS: {
      const { todos } = action
      return {
        ...state,
        isFetching: false,
        fetchError: null,
        todos
      }
    }
    case FETCH_FAILED: {
      const { error } = action
      return {
        ...state,
        isFetching: false,
        fetchError: error
      }
    }
    case TOGGLE_CREATE_DIALOG: {
      const { show } = action
      return {
        ...state,
        showCreateDialog: typeof show !== 'undefined' || show !== null ? show : !state.show
      }
    }
    case CREATE_TASK: {
      const { task } = action
      return {
        ...state,
        todos: {
          ...state.todos,
          [task.id]: task
        }
      }
    }
    case EDIT_TASK: {
      const { task } = action
      return {
        ...state,
        todos: {
          ...state.todos,
          [task.id]: task
        },
        toggleError: null
      }
    }
    case EDIT_ERROR: {
      const { /* taskId,  */error } = action
      return {
        ...state,
        toggleError: error
      }
    }
    default: {
      return { ...state }
    }
  }
}

export default todoReducer
