import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import Spinner from '../common/Spinner';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

const KanbanBoard = ({ tasks, loading, onEdit, onDelete, onStatusChange }) => {
  // Setup drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Start dragging after moving 5px (prevents accidental drags on clicks)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // If dropped outside any droppable area
    if (!over) return;

    const taskId = active.id;
    const currentStatus = active.data.current?.task?.status;
    const newStatus = over.id; // The column ID is the status (todo, in-progress, done)

    // If status didn't change, do nothing
    if (currentStatus === newStatus) return;

    // Trigger API update
    onStatusChange(taskId, { status: newStatus });
  };

  if (loading) {
    return (
      <div className="empty-state">
        <Spinner size="lg" />
        <p>Loading board...</p>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
