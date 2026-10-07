const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

app.use(cors());
app.use(express.json());
app.use(express.static(ROOT_DIR));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim().toLowerCase());
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_PATH)) {
    const demoUser = {
      id: 'demo-user',
      firstName: 'ScentCafe',
      lastName: 'Customer',
      name: 'ScentCafe Customer',
      email: 'customer@scentcafe.com',
      password: bcrypt.hashSync('password123', 10)
    };

    const initialStore = {
      users: [demoUser],
      sessions: {},
      tickets: []
    };

    fs.writeFileSync(STORE_PATH, JSON.stringify(initialStore, null, 2));
  }
}

function readStore() {
  ensureDataFile();

  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Store file is malformed.');
    }

    if (!Array.isArray(parsed.users)) parsed.users = [];
    if (!parsed.sessions || typeof parsed.sessions !== 'object') parsed.sessions = {};
    if (!Array.isArray(parsed.tickets)) parsed.tickets = [];

    return parsed;
  } catch (error) {
    const recoveredStore = {
      users: [],
      sessions: {},
      tickets: []
    };

    fs.writeFileSync(STORE_PATH, JSON.stringify(recoveredStore, null, 2));
    return recoveredStore;
  }
}

function writeStore(store) {
  ensureDataFile();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

function normalizeUser(user) {
  if (!user) return null;
  return {
    id: user.id || crypto.randomUUID(),
    firstName: String(user.firstName || '').trim(),
    lastName: String(user.lastName || '').trim(),
    name: String(user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User').trim(),
    email: String(user.email || '').trim().toLowerCase(),
    password: user.password || ''
  };
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function sanitizeTicket(ticket) {
  return {
    number: ticket.number,
    name: ticket.name,
    phone: ticket.phone,
    request: ticket.request,
    service: ticket.service,
    status: ticket.status,
    date: ticket.date
  };
}

function getUserByEmail(email) {
  const store = readStore();
  return store.users.find((user) => user.email && user.email.toLowerCase() === String(email).toLowerCase());
}

function comparePassword(candidate, storedPassword) {
  if (!storedPassword) return false;
  const normalizedCandidate = String(candidate || '');

  if (storedPassword.startsWith('$2')) {
    return bcrypt.compareSync(normalizedCandidate, storedPassword);
  }

  return normalizedCandidate === storedPassword;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const store = readStore();
  const user = store.sessions[token];

  if (!user) {
    return res.status(401).json({ message: 'Invalid session' });
  }

  req.user = user;
  next();
}

function updateSessionUsers(store, oldEmail, updatedUser) {
  Object.keys(store.sessions).forEach((token) => {
    if (store.sessions[token].email === oldEmail) {
      store.sessions[token] = sanitizeUser(updatedUser);
    }
  });
}

app.get('/api/health', (_, res) => {
  res.json({ ok: true, message: 'ScentCafe backend is running' });
});

app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body || {};

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const store = readStore();
  const existingUser = store.users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const user = normalizeUser({
    id: crypto.randomUUID(),
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    email: normalizedEmail,
    password: bcrypt.hashSync(password, 10)
  });

  store.users.push(user);
  const token = createToken();
  store.sessions[token] = sanitizeUser(user);
  writeStore(store);

  res.status(201).json({ user: sanitizeUser(user), token });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter both email and password.' });
  }

  const store = readStore();
  const user = store.users.find((candidate) => candidate.email === String(email).trim().toLowerCase());

  if (!user || !comparePassword(String(password), user.password)) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createToken();
  store.sessions[token] = sanitizeUser(user);
  writeStore(store);

  res.json({ user: sanitizeUser(user), token });
});

app.post('/api/reset-password', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Please complete all fields.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const store = readStore();
  const userIndex = store.users.findIndex((user) => user.email === normalizedEmail);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'No account exists for that email address.' });
  }

  store.users[userIndex].password = bcrypt.hashSync(String(password), 10);
  writeStore(store);

  res.json({ message: 'Password reset successful.' });
});

app.get('/api/session', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.put('/api/profile', authMiddleware, (req, res) => {
  const { firstName, lastName, email } = req.body || {};

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: 'Please fill in your name and email.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const store = readStore();
  const userIndex = store.users.findIndex((user) => user.email === req.user.email);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const emailTakenByAnotherUser = store.users.some(
    (user, index) => index !== userIndex && user.email === normalizedEmail
  );

  if (emailTakenByAnotherUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const updatedUser = normalizeUser({
    ...store.users[userIndex],
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    email: normalizedEmail,
    password: store.users[userIndex].password
  });

  store.users[userIndex] = updatedUser;
  const sessionUser = sanitizeUser(updatedUser);

  updateSessionUsers(store, req.user.email, updatedUser);
  writeStore(store);

  res.json({ user: sessionUser });
});

app.get('/api/requests', authMiddleware, (req, res) => {
  const store = readStore();
  const userTickets = store.tickets.filter((ticket) => ticket && ticket.userEmail === req.user.email);
  res.json({ requests: userTickets.map(sanitizeTicket) });
});

app.post('/api/requests', authMiddleware, (req, res) => {
  const { name, phone, request, service } = req.body || {};

  if (!name || !phone || !request) {
    return res.status(400).json({ message: 'Please complete all fields.' });
  }

  const store = readStore();
  const number = `SC-${new Date().getFullYear()}-${String(store.tickets.filter((ticket) => ticket && ticket.userEmail === req.user.email).length + 1).padStart(4, '0')}`;

  const ticket = {
    number,
    name,
    phone,
    request,
    service: service || 'ScentCafe Service',
    status: 'Received',
    userEmail: req.user.email,
    date: new Date().toISOString()
  };

  store.tickets.push(ticket);
  writeStore(store);

  res.status(201).json({ ticket });
});

app.get('*', (_, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ScentCafe backend is running at http://localhost:${PORT}`);
});
