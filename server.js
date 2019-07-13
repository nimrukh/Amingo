const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const User = require('./models/User');
const Post = require('./models/Post');

const db = "mongodb+srv://astrolabs:makeithappen@cluster0-4h9ap.mongodb.net/test?retryWrites=true&w=majority"

app.use(bodyParser.urlencoded({ extended: false }));

mongoose
    .connect(db, {})
    .then(()=> console.log("Db Connected"))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.json({
    msg: "Hello Amingo!!"
}));

const userRoutes = require('./routes/User')
app.use('/users', userRoutes);

app.post('/posts', (req, res) => {
    User
    .findOne({email: req.body.email})
    .then( user => {
        console.log("User found", user);
        if (user) {
            const newPost = new Post({
                message: req.body.message,
                user: user
            })
            newPost
                .save()
                .then(post=> res.json (post))
                .catch(err => res.json(err))
        } else {
            return res.status(400).json({message: "User not found"})
        }
    })
});

//Method: GET
// Route to fetch all the posts from collection
app.get('/posts', (req, res) => {
    Post.find()
        .then(posts => res.json(posts))
        .catch(err => console.log(err)) 
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Your application is runnint @ http://localhost:${port}`));