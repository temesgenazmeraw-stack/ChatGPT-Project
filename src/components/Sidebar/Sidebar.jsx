import {
  MessageSquare,
  Search,
  Image as ImageIcon,
  LayoutGrid,
  Microscope,
  Code2,
  FolderKanban,
  PanelLeftClose,
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({ onNewChat, onMenuSelect }) {
  const handleClick = (e, fn) => {
    e.preventDefault();
    fn();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.iconBtn}>
            <PanelLeftClose size={20} />
          </div>
        </div>
        <button
          type='button'
          className={styles.iconBtn}
          onClick={e => handleClick(e, onNewChat)}
          title='New chat'
        >
          <MessageSquare size={20} />
        </button>
      </div>

      <nav className={styles.nav}>
        <button
          type='button'
          className={styles.item}
          onClick={e => handleClick(e, onNewChat)}
        >
          <MessageSquare size={18} />
          <span>New chat</span>
        </button>
        <button
          type='button'
          className={styles.item}
          onClick={e => handleClick(e, () => onMenuSelect('Search chats'))}
        >
          <Search size={18} />
          <span>Search chats</span>
        </button>
        <button
          type='button'
          className={styles.item}
          onClick={e => handleClick(e, () => onMenuSelect('Images'))}
        >
          <ImageIcon size={18} />
          <span>Images</span>
        </button>
        <button
          type='button'
          className={styles.item}
          onClick={e => handleClick(e, () => onMenuSelect('Apps'))}
        >
          <LayoutGrid size={18} />
          <span>Apps</span>
        </button>
        <button
          type='button'
          className={styles.item}
          onClick={e => handleClick(e, () => onMenuSelect('Deep research'))}
        >
          <Microscope size={18} />
          <span>Deep research</span>
        </button>
        <button
          type='button'
          className={styles.item}
          onClick={e => handleClick(e, () => onMenuSelect('Codex'))}
        >
          <Code2 size={18} />
          <span>Codex</span>
        </button>
        <button
          type='button'
          className={styles.item}
          onClick={e => handleClick(e, () => onMenuSelect('Projects'))}
        >
          <FolderKanban size={18} />
          <span>Projects</span>
        </button>
      </nav>
    </aside>
  );
}