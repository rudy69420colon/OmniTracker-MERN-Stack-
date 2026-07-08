const TaskCardSkeleton = () => {
  return (
    <div className="task-card skeleton-card" aria-hidden="true">
      <div className="task-card-top">
        <div className="task-badges">
          <span className="skeleton-line skeleton-badge" />
          <span className="skeleton-line skeleton-badge" />
        </div>
        <div className="task-actions">
          <span className="skeleton-line skeleton-icon" />
          <span className="skeleton-line skeleton-icon" />
        </div>
      </div>
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-desc" />
      <div className="skeleton-line skeleton-desc short" />
      <div className="skeleton-line skeleton-date" />
    </div>
  );
};

/**
 * Renders a grid of skeleton cards as a loading placeholder.
 * @param {number} count — number of skeleton cards to render (default 6)
 */
export const TaskCardSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="task-grid">
      {Array.from({ length: count }, (_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Renders skeleton cards inside a kanban column.
 * @param {number} count — number of skeleton cards per column (default 2)
 */
export const TaskCardSkeletonColumn = ({ count = 2 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </>
  );
};

export default TaskCardSkeleton;
