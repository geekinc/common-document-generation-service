import response from "../../lib/response-lib";
// import { indicators } from "../../lib/indicators-lib";
const { Configuration, OpenAIApi, OpenAI } = require("openai");

// Test with this CLI command: serverless invoke local --function get-chat-response --path functions\test-data\post-chat-response.json

export async function main(event, context, req) {
  console.log(event);
  let data = JSON.parse(event.body);
  let ai_response = await execute({query: data.query});


  return response.success(ai_response);

  // if (http_response.status !== 200) {
  //   return response.failure(http_response);
  // } else {
  //   return response.success(http_response.data);
  // }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function askChatGPT(message) {
  const openai = new OpenAI({
    apiKey: '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',
  });

  let industries = require('../../data/industries.json');


  const ai_response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content:
            "You are a helpful assistant.",
      },
      {
        role: "system",
        content:
            "Please return data in JSON format.",
      },
      {
        role: "system",
        content:
            "INDUSTRY DATA:\n" + JSON.stringify(industries)
      },
      { role: "user", content: message },
    ],
    response_format: { type: "json_object" },
  });

  console.log(ai_response);
  console.log(ai_response.choices[0].message);

  return ai_response.choices[0].message;
}


export async function execute({query}) {

  let lcMessage = query.toLowerCase();
  let data = [];

  if (lcMessage.includes('top') ||
      lcMessage.includes('recommended'))
  {
    return {
      status: 200,
      data: [
        {"text":await askChatGPT('Rephrase: "I will not recommend a stock. However, the stock at the top of the list on the left has the highest rank based on our list of tracked indicators."'), "icon": []}
      ]
    };
  }

  return {
    status: 200,
    data: [
      {"text":await askChatGPT(lcMessage), "icon": []}
    ]
  };

  // async function getIndicator(indicator_name, field) {
  //   let indicatorLookup = await indicators.indicator({
  //     ticker: tickerRequest,
  //     indicator_name: indicator_name,
  //     field: field
  //   });
  //   if (indicatorLookup.status === 200) {
  //     data.push({
  //       "text": indicator_name + ": <strong>" + indicatorLookup.data + "</strong>",
  //       "icon": []
  //     });
  //   }
  // }

  // Fetch specific stock data
  // let tickerRequest = lcMessage.match(/\$[a-z]{3,4}/g);
  // tickerRequest = ("" + tickerRequest).replace('$', '').toUpperCase();
  // if (tickerRequest.length > 0)
  // {
  //   let indicatorLookup = await indicators.indicator({ ticker: tickerRequest, indicator_name: 'Digital-Engagement-Chart-Week', field: 'value' });
  //   if (indicatorLookup.status === 200) {
  //     data.push({"text": "<img width='450' src='" + indicatorLookup.data + "' /><br /><strong>Digital Engagement - Past 7 days</strong>", "icon": []});
  //   }
  //
  //   await getIndicator('Average Directional Index (14)', 'action');
  //   await getIndicator('Awesome Oscillator', 'action');
  //   await getIndicator('Bull Bear Power', 'action');
  //   await getIndicator('Commodity Channel Index (20)', 'action');
  //   await getIndicator('Exponential Moving Average (10)', 'action');
  //   await getIndicator('Exponential Moving Average (20)', 'action');
  //   await getIndicator('Exponential Moving Average (30)', 'action');
  //   await getIndicator('Exponential Moving Average (50)', 'action');
  //   await getIndicator('Exponential Moving Average (100)', 'action');
  //   await getIndicator('Exponential Moving Average (200)', 'action');
  //   await getIndicator('Hull Moving Average (9)', 'action');
  //   await getIndicator('Ichimoku Base Line (9, 26, 52, 26)', 'action');
  //   await getIndicator('MACD Level (12, 26)', 'action');
  //   await getIndicator('Momentum (10)', 'action');
  //   await getIndicator('Relative Strength Index (14)', 'action');
  //   await getIndicator('Simple Moving Average (10)', 'action');
  //   await getIndicator('Simple Moving Average (20)', 'action');
  //   await getIndicator('Simple Moving Average (30)', 'action');
  //   await getIndicator('Simple Moving Average (50)', 'action');
  //   await getIndicator('Simple Moving Average (100)', 'action');
  //   await getIndicator('Simple Moving Average (200)', 'action');
  //   await getIndicator('Simple Moving Average (200)', 'action');
  //   await getIndicator('Stochastic %K (14, 3, 3)', 'action');
  //   await getIndicator('Stochastic RSI Fast (3, 3, 14, 14)', 'action');
  //   await getIndicator('Ultimate Oscillator (7, 14, 28)', 'action');
  //   await getIndicator('Volume Weighted Moving Average (20)', 'action');
  //   await getIndicator('Williams Percent Range (14)', 'action');
  //
  //   // Respond with a reasonable reply
  //   // data.push({"text": "Here's a look at the digital engagement over the last five days: <img width='450' src='http://fs-mount.s3-website.ca-central-1.amazonaws.com/TXG-NASDAQ-bwdaily-search_volume-over-time.png' />", "icon": []});
  //   // data.push({"text": "This shows a clear <strong>BUY</strong> signal with 14 buy indicators, 10 neutral indicators, and only 2 sell indicators", "icon": []});
  // }

  return {
    status: 200,
    data: data
  };
}
