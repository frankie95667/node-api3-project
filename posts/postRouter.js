const express = require("express");

const router = express.Router();

const Posts = require("./postDb");

router.get("/", (req, res) => {
  // do your magic!
  Posts.get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          errorMessage: "Something went wrong when getting posts from db",
        });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  // do your magic!
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.post.id)
  .then(count => {
    res.status(200).json({message: "Post was successfully deleted"})
  })
  .catch(err => {
    res.status(500).json({errorMessage: "Something went wrong when trying to delete the post from db"})
  })
});

router.put("/:id", validatePostId, validatePost, (req, res) => {
  // do your magic!
  Posts.update(req.post.id, req.body)
  .then(count => {
    if(count){
      Posts.getById(req.post.id)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({errorMessage: "Something went wrong when trying to update the post in db"})
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({errorMessage: "Something went wrong when trying to update the post in db"})
  })
  
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  Posts.getById(req.params.id)
    .then((post) => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(400).json({ message: "post not found" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          errorMessage: "Something went wrong when getting post from db",
        });
    });
}

function validatePost(req, res, next){
  if(!isEmpty(req.body)){
    if(req.body.text){
      next();
    } else {
      res.status(400).json({message: "missing required text field"})
    }
  } else {
    res.status(400).json({message: "missing post data"})
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
