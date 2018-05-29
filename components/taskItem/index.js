import MoleculeQuery from 'concore-sdk-js/lib/browser/Datacore/MoleculeQuery'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'

import { todoActions } from '@reducers/todo'

export const TaskItem = ({
  task: { id, description, done },
  toggleDone
}) => (
  <ListItem
    key={id}
    dense
    button
    onClick={() => toggleDone(id)}
  >
    <Checkbox
      checked={done}
      tabIndex={-1}
      disableRipple
    />
    <ListItemText primary={description} />
  </ListItem>
)

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  toggleDone: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  toggleDone: async taskId => {
    const task = await new MoleculeQuery('Todo').get(taskId)
      .catch(err => dispatch(todoActions.editError(taskId, err)))
    task.set('done', !task.get('done'))
    await task.save()
      .catch(err => dispatch(todoActions.editError(taskId, err)))
    dispatch(todoActions.edit({
      id: task.id,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      ...task.get()
    }))
  }
})

export default connect(null, mapDispatchToProps)(TaskItem)
