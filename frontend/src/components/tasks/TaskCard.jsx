import { useState } from 'react';
import { Pencil, Trash2, Calendar, ChevronDown } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const STATUS_CYCLE = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };

const STATUS_LABELS = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const PRIORITY_COLORS = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
};

const STATUS_CLASSES = {
  todo: 'status-todo',
  'in-progress': 'status-inprogress',
  done: 'status-done',
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusCycle = () => {
    const nextStatus = STATUS_CYCLE[task.status];
    onStatusChange(task._id, { status: nextStatus });
  };

  const dueDateFormatted = task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : null;
  const isOverdue = task.dueDate && task.status !== 'done' && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <div className={`task-card ${task.status === 'done' ? 'task-done' : ''}`}>
      <div className="task-card-top">
        <div className="task-badges">
          <span className={`badge badge-priority ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </span>
          <button
            id={`status-btn-${task._id}`}
            className={`badge badge-status ${STATUS_CLASSES[task.status]}`}
            onClick={handleStatusCycle}
            title="Click to advance status"
          >
            {STATUS_LABELS[task.status]}
            <ChevronDown size={11} />
          </button>
        </div>

        <div className="task-actions">
          <button
            id={`edit-btn-${task._id}`}
            className="icon-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <Pencil size={14} />
          </button>
          <button
            id={`delete-btn-${task._id}`}
            className="icon-btn delete-btn"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {dueDateFormatted && (
        <div className={`task-due-date ${isOverdue ? 'overdue' : ''} ${isDueToday ? 'due-today' : ''}`}>
          <Calendar size={12} />
          <span>
            {isOverdue ? '⚠ Overdue · ' : isDueToday ? '📅 Due today · ' : ''}
            {dueDateFormatted}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
