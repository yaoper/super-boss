const express = require('express');
const path = require('path');
const cors = require('cors');
const { handleAiResponse } = require('./aiService');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// 路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// AI响应API
app.post('/api/ai-response', async (req, res) => {
  try {
    const { message, aiId } = req.body;
    if (!message || !aiId) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    
    const response = await handleAiResponse(message, aiId);
    res.json({ response });
  } catch (error) {
    console.error('AI响应错误:', error);
    res.status(500).json({ error: '获取AI响应失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 