// code away!
const express = require('express');
const server = express();
const users = require('./users/userRouter');
const posts = require('./posts/postRouter');
const PORT = process.env.PORT || 5000;

server.use(function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`)
    next();
})
server.use(express.json());
server.use('/api/users', users);
server.use('/api/posts', posts);

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})
