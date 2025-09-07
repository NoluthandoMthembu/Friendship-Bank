import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import styles from '../../styles/MainApp.module.css';

export default function FriendPage() {
  const [userName, setUserName] = useState('');
  const [friend, setFriend] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
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

  const handleTransaction = (e, isPositive) => {
    e.preventDefault();
    
    if (!amount.trim() || isNaN(Number(amount))) {
      alert('Please enter a valid amount');
      return;
    }

    const numAmount = Number(amount);
    if (numAmount <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

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
      amount: isPositive ? numAmount : -numAmount,
      description: description.trim() || (isPositive ? 'Money received' : 'Money given'),
      date: new Date().toISOString(),
    };

    // Update friend
    const updatedFriend = {
      ...storedFriends[friendIndex],
      balance: storedFriends[friendIndex].balance + (isPositive ? numAmount : -numAmount),
      transactions: [transaction, ...storedFriends[friendIndex].transactions],
    };

    // Update friends array
    storedFriends[friendIndex] = updatedFriend;
    localStorage.setItem('friends', JSON.stringify(storedFriends));
    
    // Update state
    setFriend(updatedFriend);
    setAmount('');
    setDescription('');
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

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h3>Current Balance</h3>
            <p className={`${styles.friendBalance} ${friend.balance >= 0 ? styles.positive : styles.negative}`}>
              {friend.balance}
            </p>
          </div>
          <div>
            <h3>Add Transaction</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className={styles.input}
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className={styles.input}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={(e) => handleTransaction(e, false)}
                  className={styles.button}
                  style={{ backgroundColor: '#dc3545', flex: 1 }}
                >
                  I Gave
                </button>
                <button 
                  onClick={(e) => handleTransaction(e, true)}
                  className={styles.button}
                  style={{ backgroundColor: '#28a745', flex: 1 }}
                >
                  I Received
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <h3>Transaction History</h3>
          {friend.transactions.length === 0 ? (
            <p className={styles.noFriends}>No transactions yet.</p>
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
                    {transaction.amount}
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