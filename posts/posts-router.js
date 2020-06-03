const router = require('express').Router();
const db = require('../data/db.js');

// /api/posts
router.post('/', (req, res) => {
  db.add(req.body)
    .then(post => {
      if (!post.title || !post.contents) {
        res.status(400).json({
          errorMessage: 'Please provide title and contents for the post.',
        });
      } else {
        res.status(201).json(post);
      }
    })
    .catch(err => {});
});

// 	/api/posts/:id/comments
router.post('/:id/comments', re => {});

// GET /api/posts
router.get('/', (req, res) => {
  db.find(req.query)
    .then(posts => res.status(200).json(posts))
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: 'The posts information could not be retrieved.',
      });
    });
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
        console.log(post);
      } else {
        res.status(404).json({
          errorMessage: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: 'The post information could not be retrieved' });
    });
});

// GET /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
  db.findPostComments(req.params.id)
    .then(comment => {
      if (comment) {
        res.status(200).json({ comment });
      } else {
        res.status(404).json({ errorMessage: 'Comment not found' });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'Comment could not be found' });
    });
});

// 	/api/posts/:id
router.delete('/:id', (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post) {
        db.remove(req.params.id).then(() =>
          res.status(200).json({ message: 'post deleted' })
        );
        res.status(200).json({ message: 'post deleted' });
      } else {
        res.status(404).json({
          errorMessage: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch(err => res.status(500).json({ errorMessage: 'Error with post' }));
});

// /api/posts/:id
router.put('/:id');

module.exports = router;
