const router = require('express').Router();
const db = require('../data/db.js');

// /POST /api/posts
router.post('/', (req, res) => {
  const post = req.body;
  if (post.title || post.contents) {
    db.insert(req.body)
      .then(() => {
        res.status(201).json(post);
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: 'The posts information could not be retrieved.',
        });
      });
  } else {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }
});

// 	/api/posts/:id/comments
// router.post('/:id/comments', (req, res) => {
//   db.findById(req.params.id)
//     .then(post => {
//       if (post) {
//         if (req.body.text) {
//           db.insertComment(req.body)
//             .then(() => {
//               res.status(200).json(req.body);
//             })
//             .catch(err => console.log(err));
//         } else {
//           res
//             .status(404)
//             .json({ errorMessage: 'Please provide some text to the comment' });
//         }
//       } else {
//         res.status(404).json({ errorMessage: 'The post is not found' });
//       }
//     })
//     .catch(err => {
//       res.status(500).json({ errorMessage: 'Could not post the comment' });
//     });
// });

router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const comment = { ...req.body, post_id: id };
  if (!text) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' });
  } else {
    db.findById(id)
      .then(post => {
        if (!post.length) {
          res.status(404).json({
            message: 'The post with the specified ID does not exist.',
          });
        } else {
          db.insertComment(comment)
            .then(comment => {
              res.status(201).json(comment);
            })
            .catch(error => {
              res.status(500).json({
                error:
                  'There was an error while saving the comment to the database',
              });
            });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

// GET /api/posts ------------------------------------
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

// GET /api/posts/:id --------------------------
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

// GET /api/posts/:id/comments ------------------------
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

// DELETE	/api/posts/:id ----------------------
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

// PUT /api/posts/:id ----------------
router.put('/:id', (req, res) => {
  const changes = req.body;
  db.update(req.params.id, changes)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ errorMessage: 'The post could not be found.' });
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Error updating post' });
    });
  //Ask tl about this ----------------------------
});

module.exports = router;
