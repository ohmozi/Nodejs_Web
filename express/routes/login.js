var express = require('express');
var router = express.Router();
var login = require('../lib/login');

//**** login part
router.get("/login", function(req, res){
  login.login(req, res);
});

router.post("/process_login", function(req, res){
  login.process_login(req, res);
});

router.get("/join", function(req, res){
  login.join(req, res);
});

router.post("/process_join", function(req, res){
  login.process_join(req, res);
});

router.get("/process_logout", function(req, res){
  login.process_logout(req, res);
});

module.exports = router;
