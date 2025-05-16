import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API!;
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
