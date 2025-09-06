import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [userName, setUserName] = useState(null);
  const [inputName, setInputName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      // If name exists, redirect to the main app page (which we'll create next)
      router.push('/home');
    }
  }, [router]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      localStorage.setItem('userName', inputName.trim());
      setUserName(inputName.trim());
      router.push('/home');
    }
  };

  if (userName !== null) {
    // Don't render anything while redirecting
    return null;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Friendship Bank!
        </h1>

        <p className={styles.description}>
          What should we call you?
        </p>

        <form onSubmit={handleNameSubmit} className={styles.form}>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Your Name"
            className={styles.input}
            autoFocus
          />
          <button type="submit" className={styles.button}>Continue</button>
        </form>
      </main>
    </div>
  );
}