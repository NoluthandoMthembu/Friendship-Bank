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
          <span>Hello, {userName}!</span>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}