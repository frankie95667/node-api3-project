// code away!
const express = require('express');
const server = express();
const users = require('./users/userRouter');
const posts = require('./posts/postRouter');
const PORT = 5000;

server.use(function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`)
    next();
})
server.use(express.json());
server.use('/api/users', users);
server.use('/api/posts', posts);

server.listen(process.env.PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})
