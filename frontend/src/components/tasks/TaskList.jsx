import TaskCard from './TaskCard';
import Spinner from '../common/Spinner';
import { ClipboardList } from 'lucide-react';

const TaskList = ({ tasks, loading, onEdit, onDelete, onStatusChange }) => {
  if (loading) {
    return (
      <div className="empty-state">
        <Spinner size="lg" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={52} className="empty-icon" />
        <h3>No tasks found</h3>
        <p>Create your first task or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default TaskList;
