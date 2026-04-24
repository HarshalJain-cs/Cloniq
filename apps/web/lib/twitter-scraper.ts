/**
 * Twitter/X Scraper
 * Fetches user tweets to extract personality and communication style
 */

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

interface TwitterUserData {
  id: string;
  username: string;
  name: string;
  description?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

interface TwitterScrapedData {
  user: TwitterUserData;
  tweets: Tweet[];
  personality_summary: string;
}

/**
 * Fetch user data and recent tweets using Twitter API v2
 */
export async function scrapeTwitterProfile(username: string): Promise<TwitterScrapedData> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    throw new Error("TWITTER_BEARER_TOKEN not configured. Please add it to your .env.local file.");
  }

  // Remove @ if present
  const cleanUsername = username.replace(/^@/, "");

  try {
    // Step 1: Get user ID from username
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=description,public_metrics`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      const error = await userResponse.json();

      // Handle specific Twitter API errors
      if (error.title === "CreditsDepleted") {
        throw new Error(
          "Twitter API credits depleted. Twitter no longer offers a free tier. " +
          "Please upgrade your Twitter Developer plan or use RapidAPI as an alternative."
        );
      }

      throw new Error(error.detail || `Failed to fetch user: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    const user: TwitterUserData = userData.data;

    // Step 2: Get user's recent tweets (max 100)
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${user.id}/tweets?max_results=100&tweet.fields=created_at,public_metrics&exclude=retweets,replies`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!tweetsResponse.ok) {
      const error = await tweetsResponse.json();
      throw new Error(error.detail || `Failed to fetch tweets: ${tweetsResponse.status}`);
    }

    const tweetsData = await tweetsResponse.json();
    const tweets: Tweet[] = tweetsData.data || [];

    // Step 3: Generate personality summary from tweets
    const personality_summary = await extractPersonalityFromTweets(user, tweets);

    return {
      user,
      tweets,
      personality_summary,
    };
  } catch (error: any) {
    console.error("[Twitter Scraper] Error:", error);
    throw error;
  }
}

/**
 * Alternative: Scrape using RapidAPI (no approval needed)
 */
export async function scrapeTwitterProfileRapidAPI(username: string): Promise<TwitterScrapedData> {
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  if (!rapidApiKey) {
    throw new Error("RAPIDAPI_KEY not configured");
  }

  const cleanUsername = username.replace(/^@/, "");

  try {
    // Fetch user profile and tweets
    const response = await fetch(
      `https://twitter154.p.rapidapi.com/user/details?username=${cleanUsername}&include_tweets=true`,
      {
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": "twitter154.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`RapidAPI request failed: ${response.status}`);
    }

    const data = await response.json();

    // Transform to our format
    const user: TwitterUserData = {
      id: data.user_id,
      username: data.username,
      name: data.name,
      description: data.description,
      public_metrics: {
        followers_count: data.followers_count,
        following_count: data.following_count,
        tweet_count: data.tweet_count,
      },
    };

    const tweets: Tweet[] = data.tweets?.map((t: any) => ({
      id: t.tweet_id,
      text: t.text,
      created_at: t.created_at,
      public_metrics: {
        retweet_count: t.retweet_count,
        reply_count: t.reply_count,
        like_count: t.like_count,
        quote_count: t.quote_count || 0,
      },
    })) || [];

    const personality_summary = await extractPersonalityFromTweets(user, tweets);

    return { user, tweets, personality_summary };
  } catch (error: any) {
    console.error("[Twitter Scraper RapidAPI] Error:", error);
    throw error;
  }
}

/**
 * Extract personality traits from tweets using AI
 */
async function extractPersonalityFromTweets(
  user: TwitterUserData,
  tweets: Tweet[]
): Promise<string> {
  if (tweets.length === 0) {
    return `Based on @${user.username}'s profile: ${user.description || "No description available"}`;
  }

  // Combine tweet texts
  const tweetTexts = tweets.slice(0, 50).map((t) => t.text).join("\n\n");

  // Use Groq to analyze personality (faster and free)
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    // Fallback: Simple analysis
    return `Communication style based on ${tweets.length} tweets from @${user.username}. Bio: ${user.description || "N/A"}`;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a personality analyst. Analyze the following tweets and extract:
1. Writing style (formal, casual, humorous, technical, etc.)
2. Tone (optimistic, sarcastic, analytical, passionate, etc.)
3. Key topics and interests
4. Communication patterns (uses emojis, hashtags, technical jargon, etc.)
5. Overall personality traits

Provide a concise summary (2-3 sentences) that can be used to configure an AI agent's personality.`,
          },
          {
            role: "user",
            content: `Username: @${user.username}\nBio: ${user.description || "N/A"}\n\nRecent Tweets:\n${tweetTexts}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Unable to extract personality";
  } catch (error) {
    console.error("[Personality Extraction] Error:", error);
    return `Communication style based on ${tweets.length} tweets from @${user.username}. Bio: ${user.description || "N/A"}`;
  }
}
