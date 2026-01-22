
/**
 * Service to interact with OpenRouter API using DeepSeek models.
 * Note: DeepSeek is a text-based LLM. Image generation is handled 
 * via keyword-based sanctuary mapping to maintain UX.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "deepseek/deepseek-r1:free";

async function callOpenRouter(prompt: string, systemInstruction?: string) {
  const apiKey = process.env.API_KEY || '';
  
  if (!apiKey) {
    console.error("OpenRouter Error: API_KEY is missing from environment.");
    return null;
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "DentZen Relief App",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": MODEL_NAME,
        "messages": [
          ...(systemInstruction ? [{ "role": "system", "content": systemInstruction }] : []),
          { "role": "user", "content": prompt }
        ],
        "temperature": 0.7,
        "max_tokens": 500
      })
    });

    if (!response.ok) {
      // Try to get detailed error message from OpenRouter
      const errorJson = await response.json().catch(() => ({}));
      const errorMessage = errorJson.error?.message || response.statusText;
      throw new Error(`OpenRouter API error: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.warn("OpenRouter Warning: Received empty response content.");
      return null;
    }

    return content;
  } catch (error) {
    console.error("OpenRouter Detailed Error:", error);
    return null;
  }
}

/**
 * Cleans the output from reasoning models like DeepSeek-R1 
 * which often include <thought> blocks or extensive reasoning.
 */
function cleanDeepSeekResponse(text: string | null): string {
  if (!text) return "";
  
  // Remove <thought>...</thought> blocks
  let cleaned = text.replace(/<thought>[\s\S]*?<\/thought>/gi, '');
  
  // Also handle cases where reasoning is at the start without tags (common in some R1 versions)
  // or separated by multiple newlines
  const parts = cleaned.split(/\n\n+/);
  if (parts.length > 1 && (parts[0].toLowerCase().includes("i should") || parts[0].toLowerCase().includes("the user is"))) {
    cleaned = parts.slice(1).join('\n\n');
  }

  return cleaned.trim();
}

export const getReassurance = async (fear: string) => {
  const systemPrompt = "You are a comforting dental assistant. Provide a short (under 80 words), gentle, and medically reassuring explanation to help a patient with their specific fear. Do not use technical jargon. Be empathetic and warm.";
  const result = await callOpenRouter(`I am a patient and I am extremely afraid of: "${fear}". Please talk to me gently.`, systemPrompt);
  
  const cleaned = cleanDeepSeekResponse(result);
  
  return cleaned || "You are in safe hands. Modern dental techniques prioritize your comfort above all else, and we can go as slow as you need.";
};

export const getDentistInsights = async (anxietyHistory: any[]) => {
  const systemPrompt = "You are a clinical psychology consultant for dentists. Analyze patient data and provide actionable, brief communication tips.";
  const prompt = `Based on this patient's anxiety history: ${JSON.stringify(anxietyHistory)}, provide 3 brief bullet points for a dentist on how to best communicate with this patient. Focus on psychological safety.`;
  
  const result = await callOpenRouter(prompt, systemPrompt);
  const cleaned = cleanDeepSeekResponse(result);

  return cleaned || "• Explain every step before starting.\n• Use a slow, calm voice.\n• Establish a 'stop' hand signal immediately.";
};

/**
 * Since DeepSeek is a text model, we use it to extract keywords for a 
 * therapeutic visual, then return a high-quality Unsplash image URL.
 */
export const generateSanctuaryImage = async (prompt: string) => {
  try {
    const systemPrompt = "Extract exactly 3 calming nature keywords from the user prompt. Output ONLY the keywords separated by commas. No other text.";
    const result = await callOpenRouter(`Prompt: ${prompt}`, systemPrompt);
    
    const cleaned = cleanDeepSeekResponse(result);
    // Sanitize to get only the keywords
    const keywords = cleaned.replace(/[^a-zA-Z,]/g, '').trim() || "serene,nature,calm";

    // Return a high-quality Unsplash source URL using the extracted keywords
    return `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1600&keywords=${encodeURIComponent(keywords)}`;
  } catch (error) {
    console.error("Sanctuary Error:", error);
    return `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1600`;
  }
};
