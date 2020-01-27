var express = require('express');
var router = express.Router();
var author = require('../lib/author');

//**** author part
router.get("/author_list", function(req, res){
  author.author_list(req, res);
});

router.post("/process_author_create", function(req, res){
  author.process_author_create(req, res);
});

router.post("/process_author_update", function(req, res){
  author.process_author_update(req, res);
});

router.post("/process_author_delete", function(req, res){
  author.process_author_delete(req, res);
});

//symentic url  쿼리스트링 안쓰고 주소로 사용
router.get("/author_update/:authorId", function(req, res){
  author.author_update(req, res);
});

module.exports = router;
