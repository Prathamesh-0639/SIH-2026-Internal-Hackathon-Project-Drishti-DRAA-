const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const demoData = require('../data/demoData');

const findDemoUser = (email) => demoData.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = findDemoUser(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'drishti-demo-secret',
    { expiresIn: '8h' }
  );

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

const getProfile = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { loginUser, getProfile };
