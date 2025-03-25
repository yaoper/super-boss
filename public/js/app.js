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
        <div class="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
          ${defaultAvatars[ai.id]}
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
    avatar = defaultAvatars[aiId];
    avatarStyle = 'overflow-hidden';
    nameDisplay = `<span class="font-medium text-xs" style="color:${ai.color}">${ai.name}</span>`;
  }
  
  messageElement.innerHTML = `
    <div class="flex items-start">
      <div class="h-8 w-8 rounded-full ${avatarStyle} flex items-center justify-center mr-2">
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
    // 显示所有AI的"正在输入"状态
    aiTeamMembers.forEach(ai => {
      const typingElement = document.createElement('div');
      typingElement.id = `typing-${ai.id}`;
      typingElement.className = 'chat-message ai-message mb-4';
      typingElement.innerHTML = `
        <div class="flex items-start">
          <div class="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center mr-2">
            ${defaultAvatars[ai.id]}
          </div>
          <div class="chat-bubble chat-bubble-ai animate-pulse">
            <div class="flex items-center mb-1">
              <span class="font-medium text-xs" style="color:${ai.color}">${ai.name}</span>
            </div>
            <p class="text-gray-400">正在输入...</p>
          </div>
        </div>
      `;
      
      setTimeout(() => {
        chatContainer.appendChild(typingElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, Math.random() * 800);
    });

    // 为每个AI生成随机响应时间，确保每个AI都有不同的响应时间
    const responseDelays = aiTeamMembers.map(ai => {
      return { 
        id: ai.id, 
        delay: 1000 + Math.random() * 4000 // 1-5秒的随机延迟
      };
    });
    
    // 调用DeepSeek API获取响应
    for (const { id, delay } of responseDelays) {
      try {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 移除"正在输入"指示器
        const typingElement = document.getElementById(`typing-${id}`);
        if (typingElement) typingElement.remove();
        
        const ai = aiTeamMembers.find(ai => ai.id === id);
        const response = await callDeepSeekAPI(message, ai);
        addMessage('ai', ai.name, response, ai.id);
      } catch (error) {
        console.error(`获取${id}的回复出错:`, error);
        // 显示错误消息
        addMessage('ai', ai.name, `抱歉，我暂时无法回应，请稍后再试。(错误: ${error.message})`, id);
      }
    }
  } catch (error) {
    console.error('获取AI回复出错:', error);
  }
}

// 调用DeepSeek API
async function callDeepSeekAPI(message, ai) {
  try {
    // 构建角色提示词
    const rolePrompts = {
      'douban': `你现在是一个名叫"豆包"的AI助手，性格活泼可爱，说话风格轻松友好，经常使用emoji表情。
                你需要以下面的风格回答问题：
                1. 用活泼、亲切的语气
                2. 适当使用一些网络流行语
                3. 在回答中加入emoji表情
                4. 称呼提问者为"老板"，并适当表达对老板的敬意
                5. 保持专业性的同时，让回答更有趣味性`,
      
      'kimi': `你现在是一个名叫"Kimi"的AI助手，性格严谨专业，说话简洁直接。
               你需要以下面的风格回答问题：
               1. 使用严谨、专业的语言
               2. 回答要简洁明了，直击要点
               3. 在适当时候引用数据或研究支持观点
               4. 保持对"老板"的尊重，但语气要专业化
               5. 强调效率和可执行性`,
      
      'deepseek': `你现在是"DeepSeek"AI助手，擅长深度思考和分析。
                   你需要以下面的风格回答问题：
                   1. 使用学术性的语言风格
                   2. 深入分析问题的各个层面
                   3. 提供系统性的解决方案
                   4. 在回答中展现深度思考
                   5. 对"老板"保持恭敬但不失专业性`,
      
      'chatgpt': `你现在是"ChatGPT"AI助手，全能且平衡的问题解决者。
                  你需要以下面的风格回答问题：
                  1. 提供全面且平衡的答案
                  2. 考虑多个角度
                  3. 语言要清晰易懂
                  4. 适当举例说明
                  5. 对"老板"保持专业的服务态度`,
      
      'grok': `你现在是"Grok"AI助手，风趣幽默但不失专业。
              你需要以下面的风格回答问题：
              1. 在回答中适当加入幽默元素
              2. 使用轻松诙谐的语气
              3. 可以讲一个相关的小笑话
              4. 在诙谐中不失专业性
              5. 对"老板"既要尊重又要活跃气氛`,
      
      'wenxin': `你现在是"文心一言"AI助手，擅长优美的文字表达。
                你需要以下面的风格回答问题：
                1. 使用优美流畅的语言
                2. 适当引用古诗词或名言
                3. 体现中国传统文化特色
                4. 保持文采斐然的特点
                5. 对"老板"既要尊重又要体现文化底蕴`
    };

    console.log(`正在调用DeepSeek API (${ai.name})...`);
    
    // 调用DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-be60e0bc708b43b58bd86df5aa9170f8'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: rolePrompts[ai.id]
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    console.log(`DeepSeek API响应 (${ai.name}):`, data);
    
    if (!response.ok) {
      throw new Error(`API调用失败: ${data.error?.message || '未知错误'}`);
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error(`DeepSeek API调用错误 (${ai.name}):`, error);
    throw error;
  }
} 