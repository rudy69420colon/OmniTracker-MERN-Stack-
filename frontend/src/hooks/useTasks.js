import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);

      const { data } = await axiosInstance.get(`/tasks?${params.toString()}`);
      setTasks(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimistic create — insert with temp ID, replace on API success, rollback on error
  const createTask = useCallback(async (taskData) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      ...taskData,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const { data } = await axiosInstance.post('/tasks', taskData);
      // Replace temp task with real one from server
      setTasks((prev) => prev.map((t) => (t._id === tempId ? data : t)));
      toast.success('Task created!');
      return data;
    } catch (err) {
      // Rollback — remove the optimistic task
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  }, []);

  // Optimistic update — apply locally first, rollback on error
  const updateTask = useCallback(async (id, updates) => {
    let previousTasks;
    setTasks((prev) => {
      previousTasks = prev;
      return prev.map((t) => (t._id === id ? { ...t, ...updates } : t));
    });

    try {
      const { data } = await axiosInstance.put(`/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      toast.success('Task updated!');
      return data;
    } catch (err) {
      // Rollback to previous state
      if (previousTasks) setTasks(previousTasks);
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  }, []);

  // Optimistic delete — remove locally first, restore on error
  const deleteTask = useCallback(async (id) => {
    let previousTasks;
    setTasks((prev) => {
      previousTasks = prev;
      return prev.filter((t) => t._id !== id);
    });

    try {
      await axiosInstance.delete(`/tasks/${id}`);
      toast.success('Task deleted');
    } catch (err) {
      // Rollback — restore the deleted task
      if (previousTasks) setTasks(previousTasks);
      toast.error(err.response?.data?.message || 'Failed to delete task');
      throw err;
    }
  }, []);

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask };
};

export default useTasks;
