import MoleculeQuery from 'concore-sdk-js/lib/browser/Datacore/MoleculeQuery'
import Auth from 'concore-sdk-js/lib/browser/Datacore/Auth'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { compareAsc } from 'date-fns'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'

import TaskItem from '@components/taskItem'
import { todoActions } from '@reducers/todo'

import styles from './todoList.scss'

export class TodoList extends Component {
  componentDidMount () {
    const { isFetching, todos, fetchTodos } = this.props
    if (!isFetching && !todos) {
      fetchTodos()
    }
  }

  static defaultProps = {
    todos: null,
    isFetching: false,
    fetchError: null
  }

  static propTypes = {
    todos: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.string,
      description: PropTypes.string
    })),
    isFetching: PropTypes.bool,
    fetchError: PropTypes.any,
    fetchTodos: PropTypes.func.isRequired
  }

  render () {
    const { isFetching, fetchError, todos } = this.props
    return (
      <Card className={styles.root}>
        {isFetching && <CircularProgress />}
        {todos && Boolean(Object.values(todos).length)
          && <List className={styles.list}>
            {Object.values(todos)
              .sort((a, b) => compareAsc(a.dueDate, b.dueDate))
              .map(task => <TaskItem key={task.id} task={task} />)
            }
          </List>
        }
        {!isFetching && todos && !Object.values(todos).length && <CardContent>There&apos;s no todos. Go create one.</CardContent>}
        {fetchError && <pre>{JSON.stringify(fetchError)}</pre>}
      </Card>
    )
  }
}

const mapStateToProps = ({ todo }) => todo

const mapDispatchToProps = dispatch => ({
  fetchTodos: async () => {
    const { id: ownerId } = await Auth.getUser()
    dispatch(todoActions.fetch())
    const todosQuery = new MoleculeQuery('Todo')
    const { results: todos } = await todosQuery
      .equalTo('owner.id', ownerId)
      .find()
      .catch(err => dispatch(todoActions.fetchFailed(err)))
    const todosHash = {}
    todos.forEach(t => {
      todosHash[t.id] = {
        id: t.id,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        ...t.get()
      }
    })
    dispatch(todoActions.receiveTodos(todosHash))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)
