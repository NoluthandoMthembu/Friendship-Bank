import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import styles from '../../styles/MainApp.module.css';
import { predefinedActs } from '../../lib/data';

export default function FriendPage() {
  const [userName, setUserName] = useState('');
  const [friend, setFriend] = useState(null);
  const [customDescription, setCustomDescription] = useState('');
  const [customPoints, setCustomPoints] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // Check if user is logged in
    const storedName = localStorage.getItem('userName');
    if (!storedName) {
      router.push('/');
    } else {
      setUserName(storedName);
    }

    // Only load friend data when id is available (after hydration)
    if (id) {
      const storedFriends = JSON.parse(localStorage.getItem('friends') || '[]');
      const currentFriend = storedFriends.find(f => f.id.toString() === id.toString());
      
      if (currentFriend) {
        setFriend(currentFriend);
      } else {
        // Friend not found, redirect back to home
        router.push('/home');
      }
    }
  }, [router, id]);

  const handlePredefinedAct = (act) => {
    // Get all friends
    const storedFriends = JSON.parse(localStorage.getItem('friends') || '[]');
    const friendIndex = storedFriends.findIndex(f => f.id.toString() === id.toString());
    
    if (friendIndex === -1) {
      alert('Friend not found');
      return;
    }

    // Create transaction
    const transaction = {
      id: Date.now(),
      amount: act.value,
      description: `${act.icon} ${act.description}`,
      date: new Date().toISOString(),
    };

    // Update friend
    const updatedFriend = {
      ...storedFriends[friendIndex],
      balance: storedFriends[friendIndex].balance + act.value,
      transactions: [transaction, ...storedFriends[friendIndex].transactions],
    };

    // Update friends array
    storedFriends[friendIndex] = updatedFriend;
    localStorage.setItem('friends', JSON.stringify(storedFriends));
    
    // Update state
    setFriend(updatedFriend);
  };

  const handleCustomAct = (e) => {
    e.preventDefault();
    
    if (!customDescription.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!customPoints.trim() || isNaN(Number(customPoints))) {
      alert('Please enter valid points');
      return;
    }

    // Get all friends
    const storedFriends = JSON.parse(localStorage.getItem('friends') || '[]');
    const friendIndex = storedFriends.findIndex(f => f.id.toString() === id.toString());
    
    if (friendIndex === -1) {
      alert('Friend not found');
      return;
    }

    const pointsValue = Number(customPoints);

    // Create transaction
    const transaction = {
      id: Date.now(),
      amount: pointsValue,
      description: customDescription.trim(),
      date: new Date().toISOString(),
    };

    // Update friend
    const updatedFriend = {
      ...storedFriends[friendIndex],
      balance: storedFriends[friendIndex].balance + pointsValue,
      transactions: [transaction, ...storedFriends[friendIndex].transactions],
    };

    // Update friends array
    storedFriends[friendIndex] = updatedFriend;
    localStorage.setItem('friends', JSON.stringify(storedFriends));
    
    // Update state
    setFriend(updatedFriend);
    setCustomDescription('');
    setCustomPoints('');
    setShowCustomForm(false);
  };

  if (!friend) {
    return null; // Or a loading spinner
  }

  return (
    <div>
      <Header userName={userName} />
      <main className={styles.container}>
        <div className={styles.friendsHeader}>
          <h2>{friend.name}</h2>
          <div>
            <button 
              onClick={() => router.push('/home')} 
              className={styles.button}
              style={{ backgroundColor: '#6c757d', marginRight: '10px' }}
            >
              Back to Friends
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3>Friendship Points</h3>
            <p className={`${styles.friendBalance} ${friend.balance >= 0 ? styles.positive : styles.negative}`} style={{ fontSize: '2.5rem' }}>
              {friend.balance}
            </p>
          </div>
          
          <h3>Add Act of Kindness</h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {predefinedActs.map((act) => (
                <button 
                  key={act.description}
                  onClick={() => handlePredefinedAct(act)}
                  className={styles.button}
                  style={{ 
                    backgroundColor: act.value > 0 ? '#28a745' : '#dc3545',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.75rem'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{act.icon}</span>
                  <span>{act.description}</span>
                  <span style={{ fontWeight: 'bold' }}>{act.value > 0 ? `+${act.value}` : act.value}</span>
                </button>
              ))}
              <button 
                onClick={() => setShowCustomForm(!showCustomForm)}
                className={styles.button}
                style={{ 
                  backgroundColor: '#0070f3',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.75rem'
                }}
              >
                <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✨</span>
                <span>Custom Act</span>
              </button>
            </div>
          </div>

          {showCustomForm && (
            <form onSubmit={handleCustomAct} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Description (add emojis here!)"
                className={styles.input}
              />
              <input
                type="number"
                value={customPoints}
                onChange={(e) => setCustomPoints(e.target.value)}
                placeholder="Points (+/-)"
                className={styles.input}
              />
              <button 
                type="submit"
                className={styles.button}
                style={{ backgroundColor: '#0070f3' }}
              >
                Add Custom Act
              </button>
            </form>
          )}
        </div>

        <div>
          <h3>Activity History</h3>
          {friend.transactions.length === 0 ? (
            <p className={styles.noFriends}>No activities yet.</p>
          ) : (
            <ul className={styles.friendList}>
              {friend.transactions.map((transaction) => (
                <li key={transaction.id} className={styles.friendItem}>
                  <div>
                    <span className={styles.friendName}>{transaction.description}</span>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`${styles.friendBalance} ${transaction.amount >= 0 ? styles.positive : styles.negative}`}>
                    {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}