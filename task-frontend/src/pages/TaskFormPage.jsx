import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

export default function TaskFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoading(true);
      setApiError('');
      try {
        const data = await api.getTask(id, token);
        setTitle(data.task.title);
        setDescription(data.task.description || '');
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit, token]);

  const validate = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Title is required.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setApiError('');
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.updateTask(id, { title: title.trim(), description }, token);
        navigate(`/tasks/${id}`);
      } else {
        const data = await api.createTask({ title: title.trim(), description }, token);
        navigate(`/tasks/${data.task.id}`);
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner label="Loading task…" />;

  return (
    <div className="page">
      <Link to="/tasks" className="back-link">
        ← Back to tasks
      </Link>
      <h1>{isEdit ? 'Edit task' : 'New task'}</h1>
      <ErrorBanner message={apiError} />
      <form onSubmit={handleSubmit} noValidate className="task-form">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!!fieldErrors.title}
          />
          {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
        </label>
        <label>
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
        </button>
      </form>
    </div>
  );
}
