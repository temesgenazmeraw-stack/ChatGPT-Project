import { useState } from 'react';
import axios from 'axios';
import { Bot } from 'lucide-react';
import styles from './Auth.module.css';

const API_BASE_URL = 'http://localhost:3777/api';

export default function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && !name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!email.trim() || !password) {
      setError('Email and password are both required.');
      return;
    }
    if (mode === 'register' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body =
        mode === 'login'
          ? { email: email.trim(), password }
          : { name: name.trim(), email: email.trim(), password };

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, body);

      if (response.data.success) {
        onAuthSuccess(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Bot size={28} color='white' />
          </div>
          <h1 className={styles.title}>ChatGPT Clone</h1>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input
                type='text'
                className={styles.input}
                placeholder='Enter your name'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              type='email'
              className={styles.input}
              placeholder='your@gmail.com'
              value={email}
              onChange={e => setEmail(e.target.value)} 
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              type='password'
              className={styles.input}
              placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button type='submit' className={styles.submit} disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <div className={styles.switch}>
          {mode === 'login' ? (
            <span>
              Don&apos;t have an account?{' '}
              <button type='button' className={styles.switchBtn} onClick={switchMode}>
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type='button' className={styles.switchBtn} onClick={switchMode}>
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}