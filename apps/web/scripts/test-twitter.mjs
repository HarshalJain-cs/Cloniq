import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

console.log('🔍 Testing Twitter API Integration\n');
console.log('Bearer Token:', BEARER_TOKEN ? '✅ Found' : '❌ Missing');
console.log('Token (first 20 chars):', BEARER_TOKEN?.substring(0, 20) + '...\n');

if (!BEARER_TOKEN) {
  console.error('❌ TWITTER_BEARER_TOKEN not found in .env.local');
  process.exit(1);
}

async function testTwitterAPI() {
  const testUsername = 'elonmusk';

  try {
    console.log(`📡 Fetching user data for @${testUsername}...\n`);

    // Step 1: Get user ID
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${testUsername}?user.fields=description,public_metrics`,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    if (!userResponse.ok) {
      const error = await userResponse.json();
      throw new Error(`User fetch failed: ${JSON.stringify(error)}`);
    }

    const userData = await userResponse.json();
    const user = userData.data;

    console.log('✅ User Data Retrieved:');
    console.log(`   Username: @${user.username}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Bio: ${user.description?.substring(0, 100)}...`);
    console.log(`   Followers: ${user.public_metrics?.followers_count?.toLocaleString()}`);
    console.log(`   Tweets: ${user.public_metrics?.tweet_count?.toLocaleString()}\n`);

    // Step 2: Get recent tweets
    console.log(`📱 Fetching recent tweets...\n`);

    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${user.id}/tweets?max_results=10&tweet.fields=created_at,public_metrics&exclude=retweets,replies`,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    if (!tweetsResponse.ok) {
      const error = await tweetsResponse.json();
      throw new Error(`Tweets fetch failed: ${JSON.stringify(error)}`);
    }

    const tweetsData = await tweetsResponse.json();
    const tweets = tweetsData.data || [];

    console.log(`✅ Retrieved ${tweets.length} tweets:\n`);

    tweets.slice(0, 3).forEach((tweet, i) => {
      console.log(`${i + 1}. "${tweet.text.substring(0, 100)}..."`);
      console.log(`   Likes: ${tweet.public_metrics?.like_count || 0}, Retweets: ${tweet.public_metrics?.retweet_count || 0}\n`);
    });

    console.log('🎉 SUCCESS! Twitter API integration is working perfectly!\n');
    console.log('✅ You can now use Twitter personality import in your app.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testTwitterAPI();
