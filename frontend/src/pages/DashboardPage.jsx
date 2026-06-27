import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import TaskFilter from '../components/tasks/TaskFilter';
import TaskList from '../components/tasks/TaskList';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';
import useTasks from '../hooks/useTasks';

const DashboardPage = () => {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [filters, setFilters] = useState({ status: '', priority: '', sort: '', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [view, setView] = useState('kanban'); // 'list' or 'kanban'

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCreateTask = async (data) => {
    await createTask(data);
    setShowForm(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleUpdateTask = async (data) => {
    await updateTask(editingTask._id, data);
    setShowForm(false);
    setEditingTask(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleStatusChange = (id, update) => {
    updateTask(id, update);
  };

  // Stats
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-main">
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-chip">
            <span className="stat-number">{totalTasks}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-chip">
            <span className="stat-number stat-inprogress">{inProgressTasks}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-chip">
            <span className="stat-number stat-done">{doneTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
          {totalTasks > 0 && (
            <div className="stat-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(doneTasks / totalTasks) * 100}%` }}
                />
              </div>
              <span>{Math.round((doneTasks / totalTasks) * 100)}% done</span>
            </div>
          )}
        </div>

        {/* Filter + Add Row */}
        <div className="controls-row">
          <TaskFilter filters={filters} onChange={handleFilterChange} />
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="view-toggle">
              <button 
                className={`view-toggle-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                title="List View"
              >
                <List size={16} />
              </button>
              <button 
                className={`view-toggle-btn ${view === 'kanban' ? 'active' : ''}`}
                onClick={() => setView('kanban')}
                title="Kanban View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            <button
              id="add-task-btn"
              className="btn-primary"
              onClick={() => { setEditingTask(null); setShowForm(true); }}
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>

        {/* Task View */}
        {view === 'list' ? (
          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={handleEditTask}
            onDelete={deleteTask}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <KanbanBoard
            tasks={tasks}
            loading={loading}
            onEdit={handleEditTask}
            onDelete={deleteTask}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Task Modal */}
      {showForm && (
        <TaskForm
          initialData={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default DashboardPage;
