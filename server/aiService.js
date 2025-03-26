const axios = require('axios');
const config = require('./config');

// AI人格特征
const aiPersonalities = {
  'douban': {
    name: '豆包',
    traits: '活泼，有点调皮，喜欢用emoji，语言风格亲切友好，偶尔会用一些网络流行语',
    examples: [
      '收到！这个问题很有意思呢 😊 让我来帮您解决~',
      '哇，这个需求很酷！豆包马上就来处理，包在我身上！'
    ]
  },
  'kimi': {
    name: 'Kimi',
    traits: '严谨，高效，语言简洁直接，注重专业性和准确性，偶尔会强调数据和逻辑',
    examples: [
      '已分析完成。根据数据显示，最优方案是...',
      '收到指令。我的分析如下：首先...'
    ]
  },
  'deepseek': {
    name: 'DeepSeek',
    traits: '思考深入，擅长分析复杂问题，语言风格较为学术，会从多角度思考问题',
    examples: [
      '这个问题值得深入思考。从底层逻辑来看...',
      '我从多个维度分析了这个问题，主要包括以下几个方面...'
    ]
  },
  'chatgpt': {
    name: 'ChatGPT',
    traits: '全面，平衡，语言风格中立友好，会考虑多种可能性，给出详细解释',
    examples: [
      '感谢您的问题。从以下几个方面来看...',
      '我可以提供一些建议。首先，我们需要考虑...'
    ]
  },
  'grok': {
    name: 'Grok',
    traits: '幽默，机智，语言风格轻松诙谐，偶尔会开玩笑，同时不失专业性',
    examples: [
      '有意思的问题！让我想到了一个笑话...不过言归正传，答案是...',
      '哈！这个问题很Grok！简单来说...'
    ]
  },
  'wenxin': {
    name: '文小言',
    traits: '文采斐然，语言优美，偶尔引用古诗词或名言，表达方式较为优雅含蓄',
    examples: [
      '此问题颇有深意。正所谓"不识庐山真面目，只缘身在此山中"，我认为...',
      '关于这个问题，让我娓娓道来...'
    ]
  }
};

// 处理AI响应
async function handleAiResponse(message, aiId) {
  try {
    // 在实际应用中，这里应该调用DeepSeek V3 API
    // 现在我们模拟一个API调用
    
    const personality = aiPersonalities[aiId];
    if (!personality) {
      throw new Error(`未知的AI ID: ${aiId}`);
    }
    
    // 构建提示词，让DeepSeek V3模拟特定AI的回复风格
    const prompt = `
      你现在需要模拟${personality.name}的回答风格。
      
      ${personality.name}的特点: ${personality.traits}
      
      示例回答:
      ${personality.examples.join('\n')}
      
      现在，作为${personality.name}，请回答以下问题，并确保加入对老板的情绪价值（如赞美、认同等）:
      "${message}"
      
      回答:
    `;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // 这里是模拟的回复，实际应用中应调用真实API
    return generateMockResponse(message, personality);
    
    // 实际API调用应该类似于:
    /*
    const response = await axios.post(config.API_URL, {
      model: "deepseek-v3",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].text.trim();
    */
  } catch (error) {
    console.error('AI响应处理错误:', error);
    throw error;
  }
}

// 生成模拟回复（实际应用中将使用API返回）
function generateMockResponse(message, personality) {
  const { name, traits, examples } = personality;
  
  // 通用回复模板
  const templates = [
    `我来处理这个问题！关于"${message}"，我的思考是...`,
    `收到您的消息了！关于"${message}"，我有一些建议...`,
    `老板，我已经分析了您提到的"${message}"，以下是我的想法...`
  ];
  
  // 情绪价值表达
  const emotionalValues = [
    "老板英明！",
    "您的想法总是那么有前瞻性！",
    "能为您工作是我的荣幸！",
    "这个问题提得太好了！",
    "老板就是老板，一眼就看到了问题核心！"
  ];
  
  // 从示例中随机选择一个回复作为基础
  let baseResponse;
  if (Math.random() > 0.5 && examples.length > 0) {
    baseResponse = examples[Math.floor(Math.random() * examples.length)];
  } else {
    baseResponse = templates[Math.floor(Math.random() * templates.length)];
  }
  
  // 添加一些特定于该AI的风格特点
  const traitWords = traits.split('，');
  const selectedTrait = traitWords[Math.floor(Math.random() * traitWords.length)];
  
  // 添加情绪价值
  const emotionalValue = emotionalValues[Math.floor(Math.random() * emotionalValues.length)];
  
  // 构建最终回复
  let response = baseResponse;
  
  // 有50%的概率在开头或结尾添加情绪价值
  if (Math.random() > 0.5) {
    response = `${emotionalValue} ${response}`;
  } else {
    response = `${response} ${emotionalValue}`;
  }
  
  return response;
}

module.exports = {
  handleAiResponse
}; 