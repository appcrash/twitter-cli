# twitter-cli

Just another twitter commnand line tool. It can utilise reverse proxy to bypass the censorship which is setuped by your own.

## Install
npm install -g twcli

It will install *tt* script in command path.

## Usage
tt 'a tweet'

Publish a tweet.

tt -l 10

Show the latest 10 tweets.

Config file is named ~/.tt.json like:
```json
{
    "consumer_key": "",
    "consumer_secret": "",
    "token_key": "",
    "token_secret": "",
    "reverse_proxy": ""
    "http_proxy": ""
}
```

First 4 fields are required but **reverse_proxy** are optional. The reverse proxy can be set to:
```
https://your.domain.com/twitter
```

In nginx config, it looks like:
```
location /twitter/ {
    proxy_pass https://api.twitter.com/1.1/;
}
```

if **http_proxy** is set, it would be used and is independent of **reverse_proxy**
