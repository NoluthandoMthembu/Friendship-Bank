import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import styles from '../styles/MainApp.module.css';

export default function HomePage() {
  const [userName, setUserName] = useState('');
  const [friends, setFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    console.log('userName from localStorage:', storedName); // Add this line
    if (!storedName) {
      router.push('/');
    } else {
      setUserName(storedName);
      const storedFriends = JSON.parse(localStorage.getItem('friends') || '[]');
      setFriends(storedFriends);
    }
  }, [router]);

  const saveFriends = (updatedFriends) => {
    localStorage.setItem('friends', JSON.stringify(updatedFriends));
    setFriends(updatedFriends);
  };

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      const newFriend = {
        id: Date.now(),
        name: newFriendName.trim(),
        balance: 0,
        transactions: [],
      };
      const updatedFriends = [...friends, newFriend];
      saveFriends(updatedFriends);
      setNewFriendName('');
    }
  };

  const handleClearFriends = () => {
    if (window.confirm('Are you sure you want to clear all friends? This cannot be undone.')) {
      saveFriends([]);
    }
  };

  if (!userName) {
    return null; // Or a loading spinner
  }

  return (
    <div>
      <Header userName={userName} />
      <main className={styles.container}>
        <div className={styles.friendsHeader}>
          <h2>Your Friends</h2>
          <form onSubmit={handleAddFriend} className={styles.addFriendForm}>
            <input
              type="text"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="Add new friend"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>Add</button>
          </form>
        </div>

        {friends.length === 0 ? (
          <p className={styles.noFriends}>No friends yet. Add one!</p>
        ) : (
          <ul className={styles.friendList}>
            {friends
              .sort((a, b) => b.balance - a.balance)
              .map((friend) => (
              <li key={friend.id} className={styles.friendItem} onClick={() => router.push(`/friend/${friend.id}`)}>
                <span className={styles.friendName}>{friend.name}</span>
                <span className={`${styles.friendBalance} ${friend.balance >= 0 ? styles.positive : styles.negative}`}>
                  {friend.balance}
                </span>
              </li>
            ))}
          </ul>
        )}
         {friends.length > 0 && (
            <div className={styles.clearButtonContainer}>
                <button onClick={handleClearFriends} className={styles.clearButton}>
                    Clear All Friends
                </button>
            </div>
        )}
      </main>
    </div>
  );
}