import axios from "axios";

const OPENAI_API_KEY =
  "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"; // <-- Your OpenAI API key (dev only)

const openai = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

export const getOpenAIResponse = async (prompt: string) => {
  const response = await openai.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
    }
  );
  return response.data;
};
