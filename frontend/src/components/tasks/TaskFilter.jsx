import { Filter, ArrowUpDown, Search } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Newest First' },
  { value: 'dueDate', label: 'Due Date' },
];

const TaskFilter = ({ filters, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    onChange({ status: '', priority: '', sort: '', search: '' });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.sort || filters.search;

  return (
    <div className="task-filter">
      <div className="filter-controls">
        <div className="filter-icon-label">
          <Filter size={15} />
          <span>Filter</span>
        </div>

        <div className="input-wrapper" style={{ minWidth: '200px' }}>
          <Search size={14} className="input-icon" />
          <input
            type="text"
            name="search"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={handleChange}
            className="filter-select"
            style={{ paddingLeft: '32px' }}
          />
        </div>

        <select
          id="filter-status"
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="filter-select"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          id="filter-priority"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="filter-select"
        >
          {PRIORITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="filter-icon-label">
          <ArrowUpDown size={15} />
          <span>Sort</span>
        </div>

        <select
          id="filter-sort"
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="filter-select"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            id="clear-filters-btn"
            className="btn-ghost"
            onClick={resetFilters}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
