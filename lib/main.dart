import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final String? userName = prefs.getString('userName');
  runApp(MyApp(userName: userName));
}

// Data Models

class Mood {
  final String name;
  final String emoji;
  Mood(this.name, this.emoji);
}

final List<Mood> moods = [
  Mood('Happy', '😊'),
  Mood('Grateful', '🙏'),
  Mood('Excited', '🤩'),
  Mood('Calm', '😌'),
  Mood('Sad', '😢'),
  Mood('Angry', '😠'),
];

class KindnessAct {
  final String description;
  final double value;
  final IconData icon;

  KindnessAct({
    required this.description,
    required this.value,
    required this.icon,
  });
}

final List<KindnessAct> predefinedActs = [
  KindnessAct(description: 'Hug', value: 5, icon: Icons.favorite_border),
  KindnessAct(description: 'Movie together', value: 10, icon: Icons.theaters),
  KindnessAct(description: 'Walk home', value: 7, icon: Icons.directions_walk),
  KindnessAct(
    description: 'Had a deep talk',
    value: 15,
    icon: Icons.record_voice_over,
  ),
  KindnessAct(
    description: 'Made them laugh',
    value: 3,
    icon: Icons.sentiment_very_satisfied,
  ),
  KindnessAct(description: 'Ghosting', value: -15, icon: Icons.visibility_off),
  KindnessAct(description: 'Being late', value: -5, icon: Icons.alarm),
  KindnessAct(
    description: 'Forgot their birthday',
    value: -20,
    icon: Icons.cake,
  ),
];

class Friend {
  String name;
  String avatar;
  double balance;
  List<Transaction> transactions;

  Friend({
    required this.name,
    this.avatar = 'assets/images/default_avatar.png',
    this.balance = 0.0,
    List<Transaction>? transactions,
  }) : transactions = transactions ?? [];

  Map<String, dynamic> toJson() => {
    'name': name,
    'avatar': avatar,
    'balance': balance,
    'transactions': transactions.map((t) => t.toJson()).toList(),
  };

  factory Friend.fromJson(Map<String, dynamic> json) {
    var transactionsFromJson = json['transactions'] as List;
    List<Transaction> transactionList = transactionsFromJson
        .map((t) => Transaction.fromJson(t))
        .toList();
    return Friend(
      name: json['name'],
      avatar: json['avatar'],
      balance: json['balance'],
      transactions: transactionList,
    );
  }
}

class Transaction {
  final String description;
  final double amount;
  final DateTime date;

  Transaction({
    required this.description,
    required this.amount,
    required this.date,
  });

  Map<String, dynamic> toJson() => {
    'description': description,
    'amount': amount,
    'date': date.toIso8601String(),
  };

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      description: json['description'],
      amount: json['amount'],
      date: DateTime.parse(json['date']),
    );
  }
}

// Main App Widget
class MyApp extends StatelessWidget {
  final String? userName;
  const MyApp({super.key, this.userName});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Friendship Bank',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: userName == null
          ? const WelcomeScreen()
          : MoodScreen(userName: userName!),
    );
  }
}

// Welcome Screen - Asks for user's name
class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  _WelcomeScreenState createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  final _nameController = TextEditingController();

  void _saveNameAndContinue() async {
    if (_nameController.text.isNotEmpty) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userName', _nameController.text);
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => MoodScreen(userName: _nameController.text),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Welcome to Friendship Bank!',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 16),
              Text(
                'What should we call you?',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 24),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Your Name',
                  border: OutlineInputBorder(),
                ),
                textAlign: TextAlign.center,
                autofocus: true,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _saveNameAndContinue,
                child: const Text('Continue'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Mood Screen - Asks for user's mood
class MoodScreen extends StatelessWidget {
  final String userName;
  const MoodScreen({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Hey $userName!',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 16),
              Text(
                'How are you feeling today?',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 24),
              Expanded(
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 2.5,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  itemCount: moods.length,
                  itemBuilder: (context, index) {
                    final mood = moods[index];
                    return ElevatedButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const HomeScreen(),
                          ),
                        );
                      },
                      child: Text('${mood.emoji} ${mood.name}'),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Home Screen - Displays list of friends
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Friend> _friends = [];

  @override
  void initState() {
    super.initState();
    _loadFriends();
  }

  Future<void> _loadFriends() async {
    final prefs = await SharedPreferences.getInstance();
    final String? friendsJson = prefs.getString('friends');
    if (friendsJson != null) {
      final List<dynamic> friendsData = jsonDecode(friendsJson);
      setState(() {
        _friends = friendsData.map((data) => Friend.fromJson(data)).toList();
      });
    }
  }

  Future<void> _saveFriends() async {
    final prefs = await SharedPreferences.getInstance();
    final String friendsJson = jsonEncode(
      _friends.map((f) => f.toJson()).toList(),
    );
    await prefs.setString('friends', friendsJson);
  }

  void _addFriend(String name) {
    if (name.isNotEmpty) {
      final newFriend = Friend(name: name);
      setState(() {
        _friends.add(newFriend);
      });
      _saveFriends();
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => FriendDetailScreen(
            friend: newFriend,
            onTransactionAdded: () {
              _saveFriends();
              setState(() {});
            },
          ),
        ),
      );
    }
  }

  void _showAddFriendDialog() {
    final nameController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add a new friend'),
          content: TextField(
            controller: nameController,
            decoration: const InputDecoration(hintText: "Friend's name"),
            autofocus: true,
          ),
          actions: [
            TextButton(
              child: const Text('Cancel'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: const Text('Add'),
              onPressed: () {
                _addFriend(nameController.text);
                Navigator.of(context).pop(); // Close the dialog
                // The navigation to FriendDetailScreen is now in _addFriend
              },
            ),
          ],
        );
      },
    );
  }

  void _signOut() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('userName');
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => const WelcomeScreen()),
      (Route<dynamic> route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    _friends.sort((a, b) => b.balance.compareTo(a.balance));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Friendship Bank'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: 'Sign Out',
            onPressed: _signOut,
          ),
        ],
      ),
      body: _friends.isEmpty
          ? const Center(
              child: Text(
                'No friends yet. Add one!',
                style: TextStyle(fontSize: 18),
              ),
            )
          : ListView.builder(
              itemCount: _friends.length,
              itemBuilder: (context, index) {
                final friend = _friends[index];
                return Dismissible(
                  key: Key(
                    friend.name + friend.transactions.length.toString(),
                  ), // Unique key
                  background: Container(
                    color: Colors.green,
                    alignment: Alignment.centerLeft,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: const Row(
                      children: [
                        Icon(Icons.favorite, color: Colors.white),
                        SizedBox(width: 8),
                        Text('Hug (+5)', style: TextStyle(color: Colors.white)),
                      ],
                    ),
                  ),
                  secondaryBackground: Container(
                    color: Colors.red,
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(
                          'Late (-5)',
                          style: TextStyle(color: Colors.white),
                        ),
                        SizedBox(width: 8),
                        Icon(Icons.alarm, color: Colors.white),
                      ],
                    ),
                  ),
                  onDismissed: (direction) {
                    setState(() {
                      final transaction = Transaction(
                        description: direction == DismissDirection.startToEnd
                            ? '🤗 Hug'
                            : '⏰ Late',
                        amount: direction == DismissDirection.startToEnd
                            ? 5
                            : -5,
                        date: DateTime.now(),
                      );
                      friend.transactions.insert(0, transaction);
                      friend.balance += transaction.amount;
                      _saveFriends();
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          '${direction == DismissDirection.startToEnd ? "Added a hug for" : "Marked late for"} ${friend.name}',
                        ),
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  child: ListTile(
                    leading: CircleAvatar(
                      child: Text(friend.name.substring(0, 1)),
                    ),
                    title: Text(friend.name),
                    trailing: Text(
                      friend.balance.toStringAsFixed(0),
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: friend.balance >= 0 ? Colors.green : Colors.red,
                      ),
                    ),
                    onTap: () async {
                      await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => FriendDetailScreen(
                            friend: friend,
                            onTransactionAdded: () {
                              _saveFriends();
                              setState(() {});
                            },
                          ),
                        ),
                      );
                      // Refresh the list on return
                      setState(() {});
                    },
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddFriendDialog,
        tooltip: 'Add Friend',
        child: const Icon(Icons.add),
      ),
    );
  }
}

// Friend Detail Screen - Shows balance and transaction history
class FriendDetailScreen extends StatefulWidget {
  final Friend friend;
  final VoidCallback onTransactionAdded;

  const FriendDetailScreen({
    super.key,
    required this.friend,
    required this.onTransactionAdded,
  });

  @override
  _FriendDetailScreenState createState() => _FriendDetailScreenState();
}

class _FriendDetailScreenState extends State<FriendDetailScreen> {
  void _addTransaction(Transaction transaction) {
    setState(() {
      widget.friend.transactions.insert(0, transaction);
      widget.friend.balance += transaction.amount;
    });
    widget.onTransactionAdded();
  }

  void _showAddTransactionDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add Act of Kindness'),
          content: SizedBox(
            width: double.maxFinite,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListView.builder(
                  shrinkWrap: true,
                  itemCount: predefinedActs.length,
                  itemBuilder: (context, index) {
                    final act = predefinedActs[index];
                    return ListTile(
                      leading: Icon(
                        act.icon,
                        color: act.value > 0 ? Colors.green : Colors.red,
                      ),
                      title: Text(act.description),
                      trailing: Text(act.value.toStringAsFixed(0)),
                      onTap: () {
                        final transaction = Transaction(
                          description: act.description,
                          amount: act.value,
                          date: DateTime.now(),
                        );
                        _addTransaction(transaction);
                        Navigator.of(context).pop();
                      },
                    );
                  },
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.add_circle_outline),
                  title: const Text('Custom Act'),
                  onTap: () {
                    Navigator.of(context).pop(); // Close the first dialog
                    _showCustomActDialog();
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showCustomActDialog() {
    final descriptionController = TextEditingController();
    final amountController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add Custom Act'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Description (add emojis here!)',
                ),
                autofocus: true,
              ),
              TextField(
                controller: amountController,
                decoration: const InputDecoration(labelText: 'Points (+/-)'),
                keyboardType: const TextInputType.numberWithOptions(
                  signed: true,
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              child: const Text('Cancel'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: const Text('Add'),
              onPressed: () {
                final description = descriptionController.text;
                final amount = double.tryParse(amountController.text) ?? 0.0;
                if (description.isNotEmpty) {
                  final transaction = Transaction(
                    description: description,
                    amount: amount,
                    date: DateTime.now(),
                  );
                  _addTransaction(transaction);
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.friend.name)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Column(
                children: [
                  Text(
                    'Balance',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  Text(
                    widget.friend.balance.toStringAsFixed(0),
                    style: TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: widget.friend.balance >= 0
                          ? Colors.green
                          : Colors.red,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const Divider(),
            Expanded(
              child: widget.friend.transactions.isEmpty
                  ? const Center(child: Text('No transactions yet.'))
                  : ListView.builder(
                      itemCount: widget.friend.transactions.length,
                      itemBuilder: (context, index) {
                        final transaction = widget.friend.transactions[index];
                        return ListTile(
                          leading: Icon(
                            transaction.amount >= 0
                                ? Icons.arrow_upward
                                : Icons.arrow_downward,
                            color: transaction.amount >= 0
                                ? Colors.green
                                : Colors.red,
                          ),
                          title: Text(transaction.description),
                          subtitle: Text(
                            '${transaction.date.day}/${transaction.date.month}/${transaction.date.year}',
                          ),
                          trailing: Text(
                            transaction.amount.toStringAsFixed(0),
                            style: TextStyle(
                              color: transaction.amount >= 0
                                  ? Colors.green
                                  : Colors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddTransactionDialog,
        tooltip: 'Add Transaction',
        child: const Icon(Icons.add),
      ),
    );
  }
}
