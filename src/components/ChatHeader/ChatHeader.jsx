import { ChevronDown, LogOut } from 'lucide-react';
import styles from './ChatHeader.module.css';

export default function ChatHeader({ user, onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span>ChatGPT</span>
        <ChevronDown size={16} />
      </div>
      <div className={styles.right}>
        {user?.name && (
          <span className={styles.welcome}>Welcome Mr. {user.name}</span>
        )}
        <div className={styles.avatar}>
          {user?.name
            ? user.name
                .split(' ')
                .map(word => word[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
            : 'IT'}
        </div>
        <button
          type='button'
          className={styles.logout}
          onClick={onLogout}
          title='Log out'
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}