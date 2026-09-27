import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

export default function TasksListPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getTasks(token);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const toggleComplete = async (task) => {
    try {
      const data = await api.updateTask(task.id, { completed: !task.completed }, token);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? data.task : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.deleteTask(id, token);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>My tasks</h1>
        <Link to="/tasks/new" className="btn btn-primary">
          + New task
        </Link>
      </div>

      <ErrorBanner message={error} onRetry={loadTasks} />

      {loading ? (
        <Spinner label="Loading tasks…" />
      ) : tasks.length === 0 && !error ? (
        <p className="empty-state">No tasks yet — create your first one.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-row ${task.completed ? 'is-complete' : ''}`}>
              <label className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                />
              </label>
              <Link to={`/tasks/${task.id}`} className="task-title">
                {task.title}
              </Link>
              <div className="task-actions">
                <Link to={`/tasks/${task.id}/edit`} className="btn btn-ghost btn-small">
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost btn-small btn-danger"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
