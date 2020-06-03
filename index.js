const express = require('express');

const postsRouter = require('./posts/posts-router.js');

const server = express();

//middleware
server.use(express.json());

//endpoints
server.use('/api/posts', postsRouter);

server.listen(8000, () => {
  console.log('\nWe are Liveeee on 8000 \n');
});
