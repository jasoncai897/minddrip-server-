const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chatgpt", async (req, res) => {
  try {
    const userInput = req.body.input;
    const systemPrompt = `
你是一个记录灵感的助手。我会输入一个想法，请你帮我：
1. 判断这个想法属于哪个分类（只能从这6个中选一：英语学习、YouTube / 视频构想、创业构思、产品创意、写作与灵感、其他 / 未分类）
2. 帮我写一句标题
3. 总结整理出内容概要，适合后续归档。

请用下面的格式返回，不要加多余内容：
分类：[分类名]
标题：[标题]
内容：[整理后的内容概要]
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
    console.error("❌ OpenAI 请求失败：", err?.response?.data || err.message);
    res.status(500).send("OpenAI 请求失败");
  }
});

app.listen(3001, () => {
  console.log("✅ 代理服务器已启动：http://localhost:3001");
});
