const express = require('express');

const router = express.Router();

const Users = require('./userDb');
const Posts = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(err => {
    res.status(500).json({ message: "something went wrong when trying to save user to db"})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  Posts.insert(req.post)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Something went wrong when trying to save post to db"})
  })
  
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
  .then(users => {
    res.status(200).json(users);
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Something went wrong when trying to retrive users from db"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Something went wrong when trying to get posts from db"})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
  .then(count => {
      res.status(200).json({ message: "User successfully deleted" })
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Someething went wrong when trying to delete user in db"})
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  Users.update(req.user.id, req.body)
  .then(count => {
    if(count){
      Users.getById(req.user.id)
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: "Something went wrong when trying to get the user for db"})
      })
    }
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Something went wrong when trying to save user to db"})
  })

});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  Users.getById(req.params.id)
  .then(user => {
    if(user){
      req.user = user;
      next();
    } else {
      res.status(400).json({
        message: "invalid user id" 
      })
    }
  })
  .catch(err => {
    res.status(500).json({
      errorMessage: "Something went wrong and was unable to validate user ID"
    })
  })
}

function validateUser(req, res, next) {
  // do your magic!
  if(!isEmpty(req.body)){
    if(req.body.name){
      next();
    } else {
      res.status(400).json({ message: "missing required name field" })
    }
    
  } else {
    res.status(400).json({ message: "missing user data"})
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if(!isEmpty(req.body)){
    if(req.body.text){
      req.post = {
        ...req.body,
        user_id: req.user.id
      }
      next();
    } else {
      res.status(400).json({ message: "missing required text field" })
    }
  } else {
    res.status(400).json({ message: "missing post data" })
  }
}

function isEmpty(obj){
  for(let key in obj){
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

module.exports = router;
