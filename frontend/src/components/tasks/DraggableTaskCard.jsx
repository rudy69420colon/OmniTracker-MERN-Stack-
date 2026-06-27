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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`draggable-card ${isDragging ? 'is-dragging' : ''}`}
    >
      {/* 
        We pass a dummy onStatusChange while dragging if we wanted to disable it,
        but since dnd-kit handles events carefully, we can just pass the real one.
      */}
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
