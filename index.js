// This program for Tweet Sentement Analysis using Node.js
// Reference:https://boostlog.io/@anshulc95/twitter-sentiment-analysis-using-nodejs-5ad1331247018500491f3b6a
//AFINN-based sentiment analysis for Node.js.
//https://github.com/thisandagain/sentiment

const Twit = require("twit");
const dotenv = require("../../../../../Library/Caches/typescript/2.9/node_modules/@types/dotenv");
const Sentiment = require("sentiment");
const colors = require("colors/safe");
dotenv.config();

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  ACCESS_TOKEN,
  ACCESS_TOKEN_SECRET
} = process.env;

const config_twitter = {
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token: ACCESS_TOKEN,
  access_token_secret: ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000
};

let api = new Twit(config_twitter);

function get_text(tweet) {
  let txt = tweet.retweeted_status
    ? tweet.retweeted_status.full_text
    : tweet.full_text;
  return txt
    .split(/ |\n/)
    .filter(v => !v.startsWith("http"))
    .join(" ");
}

async function get_tweets(q, count) {
  let tweets = await api.get("search/tweets", {
    q,
    count,
    tweet_mode: "extended"
  });
  //console.log(tweets.data.statuses);
  return tweets.data.statuses.map(get_text);
}

async function main() {
  let keyword = "the sun of energy";
  let count = 100;
  const sentiment = new Sentiment();
  let tweets = await get_tweets(keyword, count);
  for (tweet of tweets) {
    let score = sentiment.analyze(tweet).comparative;
    tweet = `${tweet}\n Score: ${score}\n`; // tweet = tweet + '\n' + Score;
    if (score > 0) {
      tweet = colors.green(tweet); // Green for score > 0
    } else if (score < 0) {
      tweet = colors.red(tweet); // Red for score > 0
    } else {
      tweet = colors.blue(tweet); // Blue for score > 0
    }
    console.log(tweet);
  }
}

main();
