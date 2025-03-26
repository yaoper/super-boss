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
    name: '文小言', 
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

// 添加@选择器相关变量
let mentionedAIs = new Set(); // 存储被@的AI
let showingMentionList = false; // 是否显示@列表
let currentMentionIndex = 0;

// 添加@选择器的HTML
function createMentionList() {
  const mentionList = document.createElement('div');
  mentionList.id = 'mention-list';
  mentionList.className = 'absolute bottom-full mb-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hidden max-h-[280px] overflow-y-auto';
  
  // 添加@所有人选项
  mentionList.innerHTML = `
    <div class="mention-item py-2.5 px-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center" data-id="all">
      <div class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-2">
        <i class="fas fa-users text-sm"></i>
      </div>
      <span class="text-sm text-gray-700">所有人</span>
    </div>
    <div class="border-t border-gray-100 my-1"></div>
  `;
  
  // 添加各AI选项
  aiTeamMembers.forEach((ai, index) => {
    const aiItem = document.createElement('div');
    aiItem.className = 'mention-item py-2.5 px-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center';
    aiItem.setAttribute('data-id', ai.id);
    aiItem.innerHTML = `
      <div class="h-6 w-6 rounded-full overflow-hidden mr-2">
        ${defaultAvatars[ai.id].replace('40', '24').replace('40', '24')}
      </div>
      <span class="text-sm text-gray-700">${ai.name}</span>
    `;
    mentionList.appendChild(aiItem);
  });
  
  return mentionList;
}

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
  
  // 创建并添加@选择器
  const mentionList = createMentionList();
  messageInput.parentElement.appendChild(mentionList);
  
  // 监听输入框输入事件
  messageInput.addEventListener('input', handleInput);
  
  // 监听@选择器点击事件
  mentionList.addEventListener('click', (e) => {
    const mentionItem = e.target.closest('.mention-item');
    if (!mentionItem) return;
    handleMentionSelect(mentionItem);
  });
  
  // 添加键盘事件处理
  document.addEventListener('keydown', (e) => {
    if (!showingMentionList) return;
    
    const mentionList = document.getElementById('mention-list');
    const items = mentionList.querySelectorAll('.mention-item');
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        currentMentionIndex = (currentMentionIndex - 1 + items.length) % items.length;
        updateMentionSelection();
        break;
      case 'ArrowDown':
        e.preventDefault();
        currentMentionIndex = (currentMentionIndex + 1) % items.length;
        updateMentionSelection();
        break;
      case 'Enter':
        if (showingMentionList) {
          e.preventDefault();
          const selectedItem = items[currentMentionIndex];
          handleMentionSelect(selectedItem);
        }
        break;
      case 'Escape':
        e.preventDefault();
        mentionList.classList.add('hidden');
        showingMentionList = false;
        break;
    }
  });
  
  // 事件监听
  sendButton.addEventListener('click', () => {
    console.log('发送按钮被点击');
    sendMessage();
  });
  
  messageInput.addEventListener('keydown', (e) => {
    if (showingMentionList && e.key === 'Enter') {
      e.preventDefault();
      return;
    }
    
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

// 处理输入事件
function handleInput(e) {
  const mentionList = document.getElementById('mention-list');
  const text = e.target.value;
  const cursorPos = e.target.selectionStart;
  
  // 检查是否刚输入了@
  if (text[cursorPos - 1] === '@') {
    const rect = e.target.getBoundingClientRect();
    const lineHeight = parseInt(window.getComputedStyle(e.target).lineHeight);
    const lines = text.substr(0, cursorPos).split('\n');
    const currentLine = lines.length;
    
    mentionList.style.left = `${rect.left}px`;
    mentionList.style.bottom = `${window.innerHeight - rect.top + (lineHeight * (lines.length - 1))}px`;
    mentionList.classList.remove('hidden');
    showingMentionList = true;
    currentMentionIndex = 0;
    updateMentionSelection();
  } else if (showingMentionList && text[cursorPos - 1] === ' ') {
    mentionList.classList.add('hidden');
    showingMentionList = false;
  }
}

// 更新选中状态的函数
function updateMentionSelection() {
  const mentionList = document.getElementById('mention-list');
  const items = mentionList.querySelectorAll('.mention-item');
  
  items.forEach((item, index) => {
    if (index === currentMentionIndex) {
      item.classList.add('bg-gray-50');
    } else {
      item.classList.remove('bg-gray-50');
    }
  });
  
  // 确保选中项可见
  items[currentMentionIndex].scrollIntoView({
    block: 'nearest',
    behavior: 'smooth'
  });
}

// 处理选择的函数
function handleMentionSelect(selectedItem) {
  const messageInput = document.getElementById('message-input');
  const id = selectedItem.getAttribute('data-id');
  const text = messageInput.value;
  const cursorPos = messageInput.selectionStart;
  const lastAtPos = text.lastIndexOf('@', cursorPos - 1);
  
  if (id === 'all') {
    const newText = text.slice(0, lastAtPos) + '@所有人 ' + text.slice(cursorPos);
    messageInput.value = newText;
    mentionedAIs.clear();
  } else {
    const ai = aiTeamMembers.find(ai => ai.id === id);
    const newText = text.slice(0, lastAtPos) + `@${ai.name} ` + text.slice(cursorPos);
    messageInput.value = newText;
    mentionedAIs.add(id);
  }
  
  const mentionList = document.getElementById('mention-list');
  mentionList.classList.add('hidden');
  showingMentionList = false;
  messageInput.focus();
}

// 修改发送消息函数
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
  
  // 清空输入框和@记录
  messageInput.value = '';
  const targetAIs = mentionedAIs.size > 0 ? Array.from(mentionedAIs) : aiTeamMembers.map(ai => ai.id);
  mentionedAIs.clear();
  
  // 获取AI回复
  getAiResponses(message, targetAIs);
}

// 修改获取AI回复函数
async function getAiResponses(message, targetAIs) {
  try {
    // 显示目标AI的"正在输入"状态
    targetAIs.forEach(id => {
      const ai = aiTeamMembers.find(ai => ai.id === id);
      if (!ai) return;
      
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

    // 为目标AI生成随机响应时间
    const responseDelays = targetAIs.map(id => {
      return { 
        id, 
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

// 配置marked选项
marked.setOptions({
  highlight: function(code, language) {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language: language }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// 修改添加消息到聊天窗口函数
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
  
  // 处理消息内容，如果是AI回复则使用Markdown渲染
  const messageContent = type === 'ai' ? marked.parse(message) : message.replace(/\n/g, '<br>');
  
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
        <div class="markdown-body">${messageContent}</div>
      </div>
    </div>
  `;
  
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // 如果是AI回复，初始化代码高亮
  if (type === 'ai') {
    messageElement.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }
} 