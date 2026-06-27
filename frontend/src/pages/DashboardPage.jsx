import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import TaskFilter from '../components/tasks/TaskFilter';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import useTasks from '../hooks/useTasks';

const DashboardPage = () => {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [filters, setFilters] = useState({ status: '', priority: '', sort: '', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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
          <button
            id="add-task-btn"
            className="btn-primary"
            onClick={() => { setEditingTask(null); setShowForm(true); }}
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onEdit={handleEditTask}
          onDelete={deleteTask}
          onStatusChange={handleStatusChange}
        />
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
