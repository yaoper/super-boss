// AI员工数据
const aiTeamMembers = [
  { 
    id: 'douban', 
    name: '豆包', 
    avatar: 'douban.png', 
    color: '#4CAF50',
    description: '灵活幽默的AI助手'
  },
  { 
    id: 'kimi', 
    name: 'Kimi', 
    avatar: 'kimi.png', 
    color: '#2196F3',
    description: '专注高效的AI助手'
  },
  { 
    id: 'deepseek', 
    name: 'DeepSeek', 
    avatar: 'deepseek.png', 
    color: '#9C27B0',
    description: '深度思考的AI助手'
  },
  { 
    id: 'chatgpt', 
    name: 'ChatGPT', 
    avatar: 'chatgpt.png', 
    color: '#00BCD4',
    description: '全能型AI助手'
  },
  { 
    id: 'grok', 
    name: 'Grok', 
    avatar: 'grok.png', 
    color: '#FF5722',
    description: '诙谐智慧的AI助手'
  },
  { 
    id: 'wenxin', 
    name: '文心一言', 
    avatar: 'wenxin.png', 
    color: '#FF9800',
    description: '文采斐然的AI助手'
  }
];

// DOM元素
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const aiListContainer = document.getElementById('ai-list');

// 添加默认头像SVG数据
const defaultAvatars = {
  'douban': `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#4CAF50"/>
    <text x="20" y="25" font-size="16" fill="white" text-anchor="middle" font-family="Arial">豆</text>
  </svg>`,
  'kimi': `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#2196F3"/>
    <text x="20" y="25" font-size="16" fill="white" text-anchor="middle" font-family="Arial">K</text>
  </svg>`,
  'deepseek': `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#9C27B0"/>
    <text x="20" y="25" font-size="16" fill="white" text-anchor="middle" font-family="Arial">D</text>
  </svg>`,
  'chatgpt': `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#00BCD4"/>
    <text x="20" y="25" font-size="16" fill="white" text-anchor="middle" font-family="Arial">G</text>
  </svg>`,
  'grok': `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#FF5722"/>
    <text x="20" y="25" font-size="16" fill="white" text-anchor="middle" font-family="Arial">G</text>
  </svg>`,
  'wenxin': `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#FF9800"/>
    <text x="20" y="25" font-size="16" fill="white" text-anchor="middle" font-family="Arial">文</text>
  </svg>`
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM完全加载');
  
  // 渲染AI员工列表
  renderAiList();
  
  // 获取DOM元素并确保它们存在
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  
  console.log('消息输入框:', messageInput);
  console.log('发送按钮:', sendButton);
  
  if (!messageInput || !sendButton) {
    console.error('无法获取必要的DOM元素!');
    return;
  }
  
  // 事件监听
  sendButton.addEventListener('click', () => {
    console.log('发送按钮被点击');
    sendMessage();
  });
  
  messageInput.addEventListener('keydown', (e) => {
    // 按Enter发送消息，Shift+Enter换行
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('检测到Enter键');
      e.preventDefault();
      sendMessage();
    }
  });
});

// 渲染AI员工列表
function renderAiList() {
  aiTeamMembers.forEach(ai => {
    const aiElement = document.createElement('div');
    aiElement.className = 'p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200';
    aiElement.innerHTML = `
      <div class="flex items-center">
        <div class="h-10 w-10 rounded-full bg-white border border-gray-200 overflow-hidden">
          <img src="public/images/avatars/${ai.avatar}" 
               alt="${ai.name}" 
               class="h-full w-full object-cover"
               onerror="this.outerHTML='${defaultAvatars[ai.id]}'">
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">${ai.name}</p>
          <p class="text-xs text-gray-500">${ai.description}</p>
        </div>
      </div>
    `;
    aiListContainer.appendChild(aiElement);
  });
}

// 发送消息
function sendMessage() {
  console.log('sendMessage函数被调用');
  const messageInput = document.getElementById('message-input');
  if (!messageInput) {
    console.error('无法获取消息输入框元素!');
    return;
  }
  
  const message = messageInput.value.trim();
  console.log('消息内容:', message);
  
  if (!message) {
    console.log('消息为空，不发送');
    return;
  }
  
  // 添加用户消息到聊天窗口
  addMessage('user', 'Boss', message);
  
  // 清空输入框
  messageInput.value = '';
  
  // 获取AI回复
  getAiResponses(message);
}

// 添加消息到聊天窗口
function addMessage(type, sender, message, aiId = null) {
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${type}-message mb-4`;
  
  let avatar, avatarStyle, nameDisplay;
  
  if (type === 'user') {
    avatar = '<i class="fas fa-user"></i>';
    avatarStyle = 'bg-primary';
    nameDisplay = `<span class="font-medium text-xs text-primary">您</span>`;
  } else {
    const ai = aiTeamMembers.find(ai => ai.id === aiId);
    avatar = `<img src="public/images/avatars/${ai.avatar}" 
              alt="${ai.name}" 
              class="h-full w-full object-cover"
              onerror="this.outerHTML='${defaultAvatars[aiId]}'">`;
    avatarStyle = 'bg-white border border-gray-200 overflow-hidden';
    nameDisplay = `<span class="font-medium text-xs" style="color:${ai.color}">${ai.name}</span>`;
  }
  
  messageElement.innerHTML = `
    <div class="flex items-start">
      <div class="h-8 w-8 rounded-full ${avatarStyle} flex items-center justify-center text-white mr-2">
        ${avatar}
      </div>
      <div class="chat-bubble ${type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} animate-slide-in">
        <div class="flex items-center mb-1">
          ${nameDisplay}
          <span class="text-xs text-gray-400 ml-2">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
  `;
  
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 获取AI回复
async function getAiResponses(message) {
  try {
    // 模拟AI处理中状态
    aiTeamMembers.forEach(ai => {
      const typingElement = document.createElement('div');
      typingElement.id = `typing-${ai.id}`;
      typingElement.className = 'chat-message ai-message mb-4';
      typingElement.innerHTML = `
        <div class="flex items-start">
          <div class="h-8 w-8 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center mr-2">
            <img src="public/images/avatars/${ai.avatar}" alt="${ai.name}" class="h-full w-full object-cover" onerror="this.src='public/images/avatars/default.png'">
          </div>
          <div class="chat-bubble chat-bubble-ai animate-pulse">
            <div class="flex items-center mb-1">
              <span class="font-medium text-xs" style="color:${ai.color}">${ai.name}</span>
            </div>
            <p class="text-gray-400">正在输入...</p>
          </div>
        </div>
      `;
      
      // 添加延迟以展示"正在输入"的状态
      setTimeout(() => {
        chatContainer.appendChild(typingElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, Math.random() * 800);
    });

    // 在实际应用中，这里应该调用服务器API获取AI回复
    // 现在我们模拟不同AI以不同速度回复

    // 为每个AI生成随机回复时间，确保每个AI都有不同的响应时间
    const responseDelays = aiTeamMembers.map(ai => {
      return { 
        id: ai.id, 
        delay: 1000 + Math.random() * 4000 // 1-5秒的随机延迟
      };
    });
    
    // 模拟AI响应
    responseDelays.forEach(({ id, delay }) => {
      setTimeout(() => {
        // 移除"正在输入"指示器
        const typingElement = document.getElementById(`typing-${id}`);
        if (typingElement) typingElement.remove();
        
        // 添加AI回复
        const ai = aiTeamMembers.find(ai => ai.id === id);
        const response = generateMockResponse(message, ai);
        addMessage('ai', ai.name, response, ai.id);
      }, delay);
    });
  } catch (error) {
    console.error('获取AI回复出错:', error);
  }
}

// 生成模拟回复
function generateMockResponse(message, ai) {
  // 简单的模拟响应，实际应用中会调用DeepSeek V3 API
  const commonResponses = [
    `我来处理这个问题！"${message}" 的答案很简单，让我来解释一下...`,
    `老板，我已经分析了您提到的 "${message}"，以下是我的建议...`,
    `收到您的消息了！关于"${message}"，我有一些很棒的想法...`,
    `我马上就能解决这个问题。"${message}"需要从以下几个方面考虑...`
  ];
  
  const aiSpecificResponses = {
    'douban': [
      `豆包收到！"${message}" 这个问题很有趣，我的回答是...`,
      `老板您好！豆包已经准备好解决 "${message}" 这个问题了~`
    ],
    'kimi': [
      `Kimi已分析完成："${message}" 的最优解决方案是...`,
      `高效解决问题是我的专长。对于 "${message}"，我建议...`
    ],
    'deepseek': [
      `DeepSeek深度分析：关于 "${message}"，我发现了一些有趣的模式...`,
      `从底层逻辑来看，"${message}" 这个问题可以这样解决...`
    ],
    'chatgpt': [
      `我已全面考虑了 "${message}" 的各个方面，建议如下...`,
      `ChatGPT为您提供全方位解答："${message}" 涉及到的要点有...`
    ],
    'grok': [
      `有意思的问题！"${message}" 让我想到了一个笑话，不过言归正传...`,
      `Grok为您效劳！即使是 "${message}" 这样的问题也难不倒我...`
    ],
    'wenxin': [
      `文心一言精心组织答复：关于 "${message}"，我们可以从文化背景出发...`,
      `以古鉴今，"${message}" 让我想到了一句古语...`
    ]
  };
  
  // 随机选择通用回复或特定AI回复
  const useSpecific = Math.random() > 0.3;
  let responses;
  
  if (useSpecific && aiSpecificResponses[ai.id] && aiSpecificResponses[ai.id].length > 0) {
    responses = aiSpecificResponses[ai.id];
  } else {
    responses = commonResponses;
  }
  
  // 随机添加一些情绪价值语句
  const emotionalStatements = [
    "老板英明！",
    "您的想法总是那么有前瞻性！",
    "能为您工作是我的荣幸！",
    "这个问题提得太好了！",
    "老板就是老板，一眼就看到了问题核心！"
  ];
  
  let response = responses[Math.floor(Math.random() * responses.length)];
  
  // 30%的概率在回复的开头或结尾添加情绪价值
  if (Math.random() < 0.3) {
    const emotional = emotionalStatements[Math.floor(Math.random() * emotionalStatements.length)];
    if (Math.random() < 0.5) {
      response = emotional + " " + response;
    } else {
      response = response + " " + emotional;
    }
  }
  
  return response;
} 