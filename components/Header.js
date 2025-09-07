import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';

export default function Header({ userName }) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('friends');
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>Friendship Bank</h1>
        <div className={styles.userInfo}>
          <span>Hello, {userName || 'User'}!</span>
          <button 
            onClick={handleSignOut} 
            className={styles.signOutButton}
            style={{ backgroundColor: '#0070f3', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px', border: 'none' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}