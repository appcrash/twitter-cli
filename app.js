#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var request = require('request');
var OAuth = require('oauth-1.0a');
var colors = require('colors');


var config_json = require(getUserHome() + '/.tt.json');


var oauth = OAuth({
    consumer: {
        public: config_json.consumer_key,
        secret: config_json.consumer_secret
    },
    signature_method: 'HMAC-SHA1'
});

var token = {
    public: config_json.token_key,
    secret: config_json.token_secret
};

const rest_base = 'https://api.twitter.com/1.1/';
var reverse_proxy = config_json.reverse_proxy || rest_base;
if (reverse_proxy[reverse_proxy.length -1] !== '/') {
  reverse_proxy += '/';
}

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

function build_url(base_url,path) {
  return base_url + path.replace(/^\//,'');
}

function user_timeline(count) {
  var path = `statuses/user_timeline.json?count=${count}`;
  var request_data = {
    url : build_url(rest_base,path),
    method : 'GET'
  }
  var reverse_path = build_url(reverse_proxy,path);

  request({
    url : reverse_path,
    method : request_data.method,
    headers: oauth.toHeader(oauth.authorize(request_data, token))
  },function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      data.forEach(s => {
        var output = s.text.red + ' '.repeat(20) + s.created_at.yellow;
        console.log(output);
      })
    }
  });
}

function update_status(status) {
  var path = `statuses/update.json`;
  var request_data = {
    url : build_url(rest_base,path),
    method : 'POST',
    data : {
      status : status
    }
  }
  var reverse_path = build_url(reverse_proxy,path);

  request({
    url : reverse_path,
    method : request_data.method,
    form: oauth.authorize(request_data, token)
  },function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('Done');
    } else {
      console.log('publish tweet error');
    }
  });
}


var arg_count = argv['l'];

if (arg_count) {
  var count = 10;
  if (arg_count === parseInt(arg_count,10)) {
    count = arg_count
  }
  user_timeline(count);
} else if (argv._.length > 0) {
  var status = argv._.join('');
  update_status(status);
}


