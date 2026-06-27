import { useDroppable } from '@dnd-kit/core';
import DraggableTaskCard from './DraggableTaskCard';

const KanbanColumn = ({ id, title, tasks, onEdit, onDelete, onStatusChange }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  // Highlight column when dragging over it
  const columnStyle = {
    backgroundColor: isOver ? 'var(--bg-elevated)' : 'var(--bg-card)',
    borderColor: isOver ? 'var(--accent)' : 'var(--border)',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  };

  return (
    <div className="kanban-column" ref={setNodeRef} style={columnStyle}>
      <div className="kanban-column-header">
        <h3>
          {title}
          <span className="kanban-count">{tasks.length}</span>
        </h3>
      </div>
      
      <div className="kanban-column-content">
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', marginTop: '20px' }}>
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
