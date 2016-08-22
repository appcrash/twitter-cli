var argv = require('minimist')(process.argv.slice(2));
var request = require('request');
var OAuth = require('oauth-1.0a');
var qs = require('querystring');


var config_json = require(`${process.env.HOME}/.tt.json`);


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
    console.log(body);
  });
}

function update_status(status) {
  var path = `statuses/update.json`;
  var request_data = {
    url : build_url(rest_base,path),
    method : 'POST',
    data : {
      status : qs.escape(status)
    }
  }
  var reverse_path = build_url(reverse_proxy,path);

  request({
    url : reverse_path,
    method : request_data.method,
    form: oauth.authorize(request_data, token)
  },function(error, response, body) {
    console.log(body);
  });
}


if (argv['l']) {
  const count = argv['l'] || 20;
  user_timeline(count);
} else if (argv._.length > 0) {
  var status = argv._[0];
  update_status(status);
}


