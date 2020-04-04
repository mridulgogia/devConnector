const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const db = require('./config/keys').mongoURI;

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const passport = require('passport');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose
    .connect(db,{ useNewUrlParser: true }
    )
    .then(() => console.log('MongoDb connected'))
    .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts)

app.listen(
    port, 
    () => console.log(`Server running on port${port}`)
);