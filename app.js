const express = require('express');
const mongoose = require('mongoose');
const petRoutes = require('./routes/pets');
const ptikuRoutes = require('./routes/ptikus');
const userRoutes = require('./routes/users');
const notifRoutes = require('./routes/notifs');
const eventsRoutes = require('./routes/events');
const MCsRoutes = require('./routes/MCs');
const messageRoutes = require('./routes/messages');
const specieRoutes = require('./routes/species');

const app = express();

mongoose.connect('mongodb+srv://admin:Njikolpm54@repmindercluster.mgck9.mongodb.net/DrinksAndDragons?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected !'))
  .catch(() => console.log('MongoDB connexion failed.'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/MCs', MCsRoutes);
app.use('/api/notifs', notifRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/ptikus', ptikuRoutes);
app.use('/api/species', specieRoutes);

module.exports = app;