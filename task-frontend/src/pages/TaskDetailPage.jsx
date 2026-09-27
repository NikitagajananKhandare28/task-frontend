import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

export default function TaskDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTask = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getTask(id, token);
      setTask(data.task);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.deleteTask(id, token);
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner label="Loading task…" />;
  if (error) return <ErrorBanner message={error} onRetry={loadTask} />;
  if (!task) return null;

  return (
    <div className="page">
      <Link to="/tasks" className="back-link">
        ← Back to tasks
      </Link>
      <div className="task-detail">
        <h1>{task.title}</h1>
        <p className={`status-pill ${task.completed ? 'is-complete' : ''}`}>
          {task.completed ? 'Completed' : 'Pending'}
        </p>
        {task.description && <p className="task-description">{task.description}</p>}
        <p className="task-meta">Created {new Date(task.created_at).toLocaleString()}</p>
        <div className="task-actions">
          <Link to={`/tasks/${task.id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <button type="button" className="btn btn-ghost btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
