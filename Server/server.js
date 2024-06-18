import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { dataOptions, data, entries } from './data.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/brainOps', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define User schema and model with additional fields
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  name: { type: String },
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// New API endpoint for handling request with headers and body
app.post('/api/submit', (req, res) => {
  const headers = req.headers;
  const body = req.body;

  console.log('Headers:', headers);
  console.log('Body:', body);

  res.json({ success: true, headers, body });
});

app.get('/api/data-options', (req, res) => {
  res.json(dataOptions);
});

app.get('/api/data', (req, res) => {
  const {
    countries,
    subscriptions,
    os,
    osVersions,
    modelNames,
    plans,
    states
  } = req.query;

  const response = {};

  if (countries) {
    const countryList = countries.split(','); 
    response.countries = {}; 
    countryList.forEach(country => {
      response.countries[country] = data.countries[country];
    });
  }

  if (subscriptions) {
    const subscriptionList = subscriptions.split(',');
    response.subscriptions = {};
    subscriptionList.forEach(sub => {
      response.subscriptions[sub] = data.subscriptions[sub];
    });
  }

  if (os) {
    const osList = os.split(',');
    response.os = {};
    osList.forEach(osItem => {
      response.os[osItem] = data.os[osItem];
    });
  }

  if (osVersions) {
    const osVersionList = osVersions.split(',');
    response.osVersions = {};
    osVersionList.forEach(osVersion => {
      response.osVersions[osVersion] = data.osVersions[osVersion];
    });
  }

  if (modelNames) {
    const modelNameList = modelNames.split(',');
    response.modelNames = {};
    modelNameList.forEach(modelName => {
      response.modelNames[modelName] = data.modelNames[modelName];
    });
  }

  if (plans) {
    const planList = plans.split(',');
    response.plans = {};
    planList.forEach(plan => {
      response.plans[plan] = data.plans[plan];
    });
  }

  if (states) {
    const stateList = states.split(',');
    response.states = {};
    stateList.forEach(state => {
      response.states[state] = data.states[state];
    });
  }

  res.json(response);
});

// Endpoint to get filtered log entries
app.get('/api/entries', (req, res) => {
  const { countries, subscriptions } = req.query;
  let filteredEntries = entries;

  if (countries) {
    const countryList = countries.split(',');
    filteredEntries = filteredEntries.filter(entry => countryList.includes(entry.country));
  }

  if (subscriptions) {
    const subscriptionList = subscriptions.split(',');
    filteredEntries = filteredEntries.filter(entry => subscriptionList.includes(entry.subscription));
  }

  res.json(filteredEntries);
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists. Please login instead.' });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '2h' });

    // Return success message and token
    res.json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please signup.' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '2h' });

    // Return success message and token
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
