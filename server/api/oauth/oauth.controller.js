'use strict'; 

var _ = require('lodash');
(function(){
  var http = require("http"),
      url = require("url"),
      path = require("path"),
      OAuth = require('oauth').OAuth;

  var twoa = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    process.env.TW_OAUTH_KEY,
    process.env.TW_OAUTH_SECRET,
    "1.0",
　 "http://" + process.env.SERVICE_URL + "/twitter",
 　 "HMAC-SHA1"
  );
  console.log('twoa:',twoa, 'env',process.env.SERVICE_URL);

  var locOauth = require('./oauth.model');

  exports.otwitter = function(req, res) {
    locOauth.find(function (err, oauths) {
      console.log('twitter ao');
      twoa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
        if (error) {
            console.log(error);
            res.send("yeah no. didn't work.");
        } else {
            req.session={};
            req.session.oauth = {};
            req.session.oauth.token = oauth_token;
            console.log('oauth.token: ' + req.session.oauth.token);
            req.session.oauth.token_secret = oauth_token_secret;
            console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
            res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token);
        }
      });
    });
  }

  // Get list of oauths
  exports.twitter = function(req, res) {
    locOauth.find(function (err, oauths) {
      console.log('twitter');
      if(err) { return handleError(res, err); }
      if (req.session.oauth) {
        var url_parts = url.parse(req.url, true);
        console.log('oauth_verifier:', url_parts.query.oauth_verifier);
        req.session.oauth.verifier = url_parts.query.oauth_verifier;
        console.log('oauth:', req.session.oauth);
        var oauth = req.session.oauth;
        twoa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier,
        function(error, oauth_access_token, oauth_access_token_secret, results){
            if (error){
                console.log(error);
                res.send("yeah something broke.");
            } else {
                req.session.oauth.access_token = oauth_access_token;
                req.session.oauth.access_token_secret = oauth_access_token_secret;
                console.log(results);
                res.send("worked. nice one.");
            }
        });
      } else {
          next(new Error("you're not supposed to be here."));
      }
    });
  };

  function handleError(res, err) {
    return res.send(500, err);
  }
})();
