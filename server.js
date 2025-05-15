const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ 万能跨域配置（开发用）
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/chatgpt", async (req, res) => {
  try {
    const userInput = req.body.input;
    const systemPrompt = `
你是一个记录灵感的助手。我会输入一个想法，请你帮我判断它属于哪个分类，并总结出标题和内容。

【要求格式非常严格】如下所示，必须一行一项返回：
分类：[分类名]
标题：[一句标题]
内容：[一段内容摘要]

分类只能是：英语学习、YouTube / 视频构想、创业构思、产品创意、写作与灵感、其他 / 未分类
不要添加多余解释、不要换结构、不要标注我是 AI。
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ OpenAI 请求失败详细：", err?.response?.data || err.message);
    res.status(500).json({ error: err?.response?.data || err.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ 服务器已启动：http://localhost:${port}`);
});
