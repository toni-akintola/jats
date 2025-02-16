import { twitterSource } from "./sources/twitter";
import { redditSource } from "./sources/reddit";
import { hackernewsSource } from "./sources/hackernews";
import { SentimentResult, Mention } from "./types";

const sources = [twitterSource, redditSource, hackernewsSource];

function generateRandomSentiment(baseScore: number): number {
  return baseScore + (Math.random() * 4 - 2);
}

function generateDataPoints(location: string): Array<{ sentiment: number }> {
  let baseScore = Math.random() * 6 - 3;
  const pointCount = Math.floor(Math.random() * 1000) + 1000;
  return Array.from({ length: pointCount }, () => ({
    sentiment: generateRandomSentiment(baseScore)
  }));
}

function generateKeywords(sentiment: number): string[] {
  const positiveKeywords = [
    'excellent', 'amazing', 'wonderful', 'fantastic', 'great',
    'innovative', 'efficient', 'reliable', 'friendly', 'beautiful',
    'peaceful', 'progressive', 'sustainable', 'vibrant', 'safe'
  ];
  
  const neutralKeywords = [
    'normal', 'average', 'typical', 'standard', 'moderate',
    'usual', 'regular', 'common', 'ordinary', 'fair',
    'balanced', 'neutral', 'steady', 'consistent', 'stable'
  ];
  
  const negativeKeywords = [
    'challenging', 'difficult', 'problematic', 'concerning', 'troubled',
    'expensive', 'crowded', 'noisy', 'polluted', 'congested',
    'unsafe', 'unreliable', 'slow', 'outdated', 'inefficient'
  ];

  let keywords: string[] = [];
  const keywordCount = Math.floor(Math.random() * 5) + 5;

  if (sentiment > 0.01) {
    keywords = [...positiveKeywords];
  } else if (sentiment < -0.01) {
    keywords = [...negativeKeywords];
  } else {
    keywords = [...neutralKeywords];
  }

  return keywords
    .sort(() => Math.random() - 0.5)
    .slice(0, keywordCount);
}

const speechVariety = {
  interjections: [
    "Wow,", "Hey,", "Oh man,", "Honestly,", "Listen up -", "Y'all,", "Folks,", 
    "Real talk:", "Not gonna lie,", "Let me tell you,", "Get this -", "Check it out:",
    "Here's the thing:", "Fun fact:", "PSA:", "Hot take:", "FWIW,", "IMO,", "Unpopular opinion:",
    "Just saying,", "True story:", "Plot twist:", "Spoiler alert:", "Alright,", "Well well well,",
    "Breaking news:", "Quick update:", "Heads up:", "Friendly reminder:", "PSA!"
  ],
  emphasis: [
    "absolutely", "literally", "seriously", "totally", "completely", "100%",
    "lowkey", "highkey", "kinda", "sorta", "basically", "actually", "straight up",
    "no joke", "for real", "deadass", "ngl", "tbh", "fr fr", "without a doubt",
    "hands down", "undeniably", "genuinely", "honestly", "truly", "legitimately"
  ],
  reactions: [
    "💯", "🙌", "👏", "🔥", "🤔", "😤", "🚫", "⚠️", "🎯", "💪",
    "🌟", "✨", "🎉", "👌", "💁‍♂️", "💁‍♀️", "🤷‍♂️", "🤷‍♀️",
    "🎨", "🌿", "🌺", "🍜", "🎭", "🎪", "🎡", "🏛️", "🏢", "🌆",
    "🌃", "🌉", "🌅", "🌄", "🎪", "🎭", "🎨", "🎬", "🎼", "🎹",
    "🎸", "🎺", "🎷", "🥁", "🎤", "🎧", "🎵", "🎶", "🎪", "🎭",
    "🎨", "🖼️", "🎰", "🎲", "🎮", "🎯", "🎳", "🎪"
  ]
};

function addSpeechVariety(text: string, source: string, sentiment: number): string {
  if (source === 'Hacker News') return text;

  if (Math.random() > 0.7) return text;

  const addInterjection = Math.random() > 0.5;
  const addEmphasis = Math.random() > 0.6;
  const addTransition = Math.random() > 0.7;
  const addReaction = source === 'Twitter' && Math.random() > 0.6;

  let modifiedText = text;

  if (addInterjection) {
    const interjection = speechVariety.interjections[
      Math.floor(Math.random() * speechVariety.interjections.length)
    ];
    modifiedText = `${interjection} ${modifiedText}`;
  }

  if (addEmphasis) {
    const emphasis = speechVariety.emphasis[
      Math.floor(Math.random() * speechVariety.emphasis.length)
    ];
    const insertPoints = [
      "is", "has", "needs", "getting", "becoming", "seems", "feels"
    ];
    for (const point of insertPoints) {
      if (modifiedText.includes(` ${point} `)) {
        modifiedText = modifiedText.replace(
          ` ${point} `,
          ` ${emphasis} ${point} `
        );
        break;
      }
    }
  }

  if (addTransition && modifiedText.includes('. ')) {
    const transition = speechVariety.transitions[
      Math.floor(Math.random() * speechVariety.transitions.length)
    ];
    modifiedText = modifiedText.replace('. ', `. ${transition} `);
  }

  if (addReaction) {
    const reaction = speechVariety.reactions[
      Math.floor(Math.random() * speechVariety.reactions.length)
    ];
    modifiedText = `${modifiedText} ${reaction}`;
  }

  return modifiedText;
}

function extractCity(location: string): string {
  const parts = location.split(',');
  const city = parts[1]?.trim();
  const state = parts[2]?.trim();
  const cityName = city?.replace(/\d+/g, '');
  const stateName = state?.replace(/\d+/g, '').split(' ')[0];
  return Math.random() > 0.5 && stateName ? `${cityName}, ${stateName}` : cityName;
}

function containsUsedPhrases(text: string): boolean {
  const commonPhrases = [
    "doing the most",
    "what's up with",
    "can't with",
    "wake up",
    "real talk",
    "hot take",
    "unpopular opinion",
    "the way",
    "living my best life",
    "remember when",
    "zero regrets",
    "major shoutout",
    "can't get enough",
    "never misses",
    "big moves",
    "plot twist",
    "spoiler alert",
    "let me tell you",
    "get this",
    "check it out",
    "here's the thing"
  ];

  for (const phrase of commonPhrases) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      if (usedPhrases.has(phrase.toLowerCase())) {
        return true;
      }
      usedPhrases.add(phrase.toLowerCase());
    }
  }
  return false;
}

export function generateMentionText(location: string, sentiment: number, source: string): string {
  if (usedTemplates.size >= templates.positive.length + templates.neutral.length + templates.negative.length) {
    resetTracking();
  }

  let templateCategory: keyof typeof templates;
  if (sentiment > 0.3) {
    templateCategory = 'positive';
  } else if (sentiment < -0.3) {
    templateCategory = 'negative';
  } else {
    templateCategory = 'neutral';
  }

  const availableTemplates = templates[templateCategory].filter(t => !usedTemplates.has(t));
  
  if (availableTemplates.length === 0) {
    resetTracking();
    return generateMentionText(location, sentiment, source);
  }

  let text = '';
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    text = template.replace(/{location}/g, extractCity(location));

    Object.entries(context).forEach(([key, values]) => {
      if (text.includes(`{${key}}`)) {
        const unusedValues = values.filter(v => !usedPhrases.has(v.toLowerCase()));
        if (unusedValues.length === 0) {
          usedPhrases.clear();
        }
        const value = unusedValues.length > 0 ? 
          unusedValues[Math.floor(Math.random() * unusedValues.length)] :
          values[Math.floor(Math.random() * values.length)];
        text = text.replace(`{${key}}`, value);
        usedPhrases.add(value.toLowerCase());
      }
    });

    if (!containsUsedPhrases(text)) {
      usedTemplates.add(template);
      break;
    }

    attempts++;
  }

  if (attempts >= maxAttempts) {
    resetTracking();
    return generateMentionText(location, sentiment, source);
  }

  text = addSpeechVariety(text, source, sentiment);

  if (Math.random() > 0.8) {
    const words = text.split(' ');
    const emojiIndex = Math.floor(Math.random() * words.length);
    const emoji = speechVariety.reactions[Math.floor(Math.random() * speechVariety.reactions.length)];
    words.splice(emojiIndex, 0, emoji);
    text = words.join(' ');
  }

  switch (source) {
    case 'Twitter':
      const maxLength = Math.floor(Math.random() * 41) + 240;
      return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
    case 'Reddit':
      if (Math.random() > 0.7) {
        const extraContext = context[`${templateCategory}_aspect`][
          Math.floor(Math.random() * context[`${templateCategory}_aspect`].length)
        ];
        text += ` And another thing: ${extraContext}`;
      }
      return text;
    case 'Hacker News':
      text = text
        .replace(/(!+|emoji)/g, '.')
        .replace(/(rn|tbh|ngl|fr|lowkey|highkey)/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (Math.random() > 0.8) {
        text += ` This observation is based on ${Math.floor(Math.random() * 5) + 1} years of data analysis.`;
      }
      return text;
    default:
      return text;
  }
}

const usedTemplates = new Set<string>();
const usedPhrases = new Set<string>();

function resetTracking() {
  usedTemplates.clear();
  usedPhrases.clear();
}

const templates = {
  positive: [
    "{location} = pure magic! {positive_aspect}",
    "Just discovered {location}! {positive_aspect}",
    "{location} is {colloquial_positive} rn! {positive_aspect}",
    "Absolutely loving {location}! {positive_aspect}",
    "{location} keeps impressing! {positive_development}",
    "Been exploring {location} lately. {positive_aspect} Plus, {positive_development}",
    "Something special about {location} - {positive_aspect} and {positive_characteristic}",
    "Really impressed by {location}'s growth. {positive_development} while {positive_characteristic}",
    "After {timeframe} of observing {location}, I can confidently say: {positive_aspect}. {positive_development} while maintaining {positive_characteristic}",
    "A comprehensive look at {location} reveals significant progress: {positive_aspect}, {positive_development}, and {positive_secondary_aspect}",
    "Moved to {location} {timeframe} ago - best decision ever! {positive_aspect} and {positive_secondary_aspect}",
    "My experience in {location} has been incredible. {positive_aspect} Not to mention {positive_development}",
    "Professional opinion on {location}: exceptional progress in {positive_development}. {positive_aspect} stands out particularly",
    "Market analysis of {location} shows promising trends: {positive_aspect} combined with {positive_development}"
  ],
  neutral: [
    "Quick thoughts on {location}: {neutral_observation}",
    "{location} status update: {neutral_observation}",
    "Mixed feelings about {location}. {positive_aspect}, but {negative_aspect}",
    "{timeframe} in {location} - {neutral_observation} while {neutral_development}",
    "Analyzing {location}'s current state: {neutral_observation}. {positive_aspect}, though {negative_aspect}",
    "Spent {timeframe} researching {location}. Found that {neutral_observation} while {neutral_development}",
    "Comparing {location} to similar areas: {neutral_observation}. {neutral_development}",
    "Interesting contrasts in {location}: {positive_aspect} versus {negative_aspect}. {neutral_observation}",
    "Recent data from {location} indicates: {neutral_observation}. {neutral_development}",
    "Statistical analysis of {location} shows: {neutral_observation} with {neutral_development}"
  ],
  negative: [
    "Concerned about {location}'s {negative_aspect}",
    "Issues mounting in {location}: {negative_detail}",
    "After {timeframe} in {location}, {negative_aspect} is becoming unbearable",
    "Struggling with {location}'s {negative_aspect}. {negative_detail}",
    "Critical analysis of {location}: {negative_aspect} combined with {negative_detail}",
    "Studying {location}'s challenges: {negative_aspect}, {negative_detail}, and {negative_secondary_aspect}",
    "Suggestions for {location}: address {negative_aspect}. {suggestion_for_improvement}",
    "{location} has potential, but {negative_aspect} needs work. {suggestion_for_improvement}",
    "How {location}'s {negative_aspect} affects residents: {negative_detail}",
    "Community perspective on {location}: {negative_aspect} is causing {negative_detail}"
  ]
};

const context = {
  positive_aspect: [
    "the community is incredibly welcoming and diverse",
    "public transportation has improved dramatically",
    "the new parks and green spaces are fantastic",
    "the cultural scene keeps getting better",
    "there's been amazing progress on sustainability",
    "the local economy is thriving",
    "the sense of community is stronger than ever",
    "the balance between development and preservation is perfect",
    "the food scene is incredibly diverse and exciting",
    "the city planning has been exceptional"
  ],
  positive_secondary_aspect: [
    "the community events are bringing everyone together",
    "local businesses are flourishing",
    "the arts scene is flourishing",
    "public spaces are well-maintained",
    "educational opportunities are expanding",
    "healthcare facilities are top-notch"
  ],
  positive_development: [
    "revitalized its downtown area",
    "modernized its infrastructure",
    "expanded its cultural offerings",
    "embraced sustainable initiatives",
    "supported small businesses",
    "improved public services",
    "enhanced community spaces",
    "upgraded transportation systems",
    "preserved historical landmarks while modernizing"
  ],
  positive_characteristic: [
    "maintains its unique character while evolving",
    "supports local entrepreneurs and artists",
    "prioritizes resident well-being",
    "balances growth with sustainability",
    "invests in future generations",
    "preserves its cultural heritage",
    "adapts to changing needs",
    "fosters innovation and creativity"
  ],
  neutral_state: [
    "going through typical changes",
    "developing at a steady pace",
    "maintaining its usual patterns",
    "experiencing expected growth",
    "following regional trends",
    "showing mixed progress",
    "evolving gradually"
  ],
  neutral_observation: [
    "some areas are improving while others need work",
    "changes are happening, but slowly",
    "it's comparable to similar cities",
    "residents have varying opinions",
    "development is proceeding as expected",
    "there's a mix of positive and negative trends",
    "time will tell if changes are effective"
  ],
  neutral_development: [
    "balances various priorities",
    "adapts to new challenges",
    "manages growth steadily",
    "responds to changing demographics",
    "adjusts to market conditions",
    "implements gradual improvements"
  ],
  negative_aspect: [
    "rising living costs",
    "worsening traffic situation",
    "inadequate public transit",
    "housing affordability crisis",
    "aging infrastructure",
    "environmental concerns",
    "increasing noise pollution",
    "parking problems",
    "overcrowding issues",
    "poor urban planning"
  ],
  negative_secondary_aspect: [
    "lack of community engagement",
    "insufficient green spaces",
    "limited cultural activities",
    "poor maintenance of public areas",
    "inadequate school funding"
  ],
  negative_detail: [
    "infrastructure is struggling to keep up with growth",
    "public services are declining in quality",
    "housing prices are pushing out longtime residents",
    "traffic congestion is getting worse every month",
    "environmental issues are being ignored",
    "community feedback is often overlooked",
    "development is too aggressive",
    "public spaces are poorly maintained"
  ],
  suggestion_for_improvement: [
    "officials should focus on sustainable development",
    "we need better community engagement",
    "investment in public transportation is crucial",
    "more affordable housing options are needed",
    "environmental protection should be prioritized",
    "better urban planning could solve many issues"
  ],
  timeframe: [
    "six months",
    "a year",
    "two years",
    "several years",
    "a decade",
    "many years"
  ],
  colloquial_positive: [
    "awesome", "amazing", "incredible", "unbelievable", "exceptional"
  ]
};

export async function analyzeSentiment(
  company: string,
): Promise<AggregatedSentiment> {
  const results = await Promise.all(
    sources.map(async (source) => {
      try {
        return await source.fetchSentiment(company);
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error);
        return null;
      }
    }),
  );

  const validResults = results.filter((r): r is SentimentResult => r !== null);

  if (validResults.length === 0) {
    throw new Error("Failed to fetch sentiment from any source");
  }

  const allMentions = validResults.flatMap((r) => r.mentions);

  const totalScore = validResults.reduce((sum, r) => sum + r.score, 0);
  const averageScore = totalScore / validResults.length;

  const keywordCounts = validResults
    .flatMap((r) => r.keywords)
    .reduce(
      (acc, keyword) => {
        acc[keyword] = (acc[keyword] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  const topKeywords = Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([keyword]) => keyword);

  const sortedMentions = allMentions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const mentionsByDate = allMentions.reduce(
    (acc, mention) => {
      const date = new Date(mention.date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { sum: 0, count: 0 };
      }
      acc[date].sum += mention.sentiment;
      acc[date].count += 1;
      return acc;
    },
    {} as Record<string, { sum: number; count: number }>,
  );

  const sentimentOverTime = Object.entries(mentionsByDate)
    .map(([date, { sum, count }]) => ({
      date,
      sentiment: sum / count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    score: averageScore,
    mentions: allMentions.length,
    topKeywords,
    recentMentions: sortedMentions,
    sentimentOverTime,
  };
}

export interface AggregatedSentiment {
  score: number;
  mentions: number;
  topKeywords: string[];
  recentMentions: Mention[];
  sentimentOverTime: {
    date: string;
    sentiment: number;
  }[];
}
