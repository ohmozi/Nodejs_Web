var express = require('express');
var router = express.Router();
var topic = require('../lib/topic');

//**** topic part
router.get("/create", function(req, res){
  topic.create(req, res);
});

router.post("/process_create", function(req, res){
  topic.process_create(req, res);
});

router.post("/process_update", function(req, res){
  topic.process_update(req, res);
});

router.post("/process_delete", function(req, res){
  topic.process_delete(req, res);
});

//symentic url  쿼리스트링 안쓰고 주소로 사용
//선언을 가장 아래에 해줘야 위에서 걸리고 처리됨
router.get("/:pageId", function(req, res){
  topic.page(req, res);
});
//symentic url  쿼리스트링 안쓰고 주소로 사용
router.get("/update/:pageId", function(req, res){
  topic.update(req, res);
});

module.exports = router;
