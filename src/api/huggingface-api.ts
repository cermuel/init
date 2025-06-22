import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN =
  process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY ||
  "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";
const client = new InferenceClient(HF_TOKEN);

export const getAIResponse = async (prompt: string) => {
  try {
    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);

    // Fallback to a simpler model if the first one fails
    try {
      const fallbackResponse = await client.textGeneration({
        model: "microsoft/DialoGPT-medium",
        inputs: prompt,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          top_p: 0.95,
        },
      });

      return fallbackResponse.generated_text;
    } catch (fallbackError) {
      console.error("Fallback model also failed:", fallbackError);
      return "I'm having trouble connecting to my brain right now. Please try again in a moment.";
    }
  }
};
