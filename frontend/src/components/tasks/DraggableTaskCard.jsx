import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

const DraggableTaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: {
      task, // Pass the whole task so the drop handler knows what was dropped
    },
  });

  const style = {
    // Translate the card during dragging
    transform: CSS.Translate.toString(transform),
    // Ensure the dragging card stays on top
    zIndex: isDragging ? 100 : 'auto',
    // Hide original when drag overlay is shown
    opacity: isDragging ? 0.3 : 1,
    transition: isDragging ? 'none' : 'opacity 0.2s ease, transform 0.2s ease',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`draggable-card ${isDragging ? 'is-dragging' : ''}`}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

export default DraggableTaskCard;
