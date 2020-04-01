const express = require('express');
const mongoose = require('mongoose');

const app = express();

const db = require('./config/keys').mongoURI;

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


mongoose
    .connect(db,{ useNewUrlParser: true }
    )
    .then(() => console.log('MongoDb connected'))
    .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts)

app.listen(
    port, 
    () => console.log(`Server running on port${port}`)
);