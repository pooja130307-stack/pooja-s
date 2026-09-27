const { GoogleGenAI } = require('@google/genai');

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey
    });

    let response;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        break;
      } catch (error) {
        if (error.message.includes('503') && attempt < 3) {
          console.log(
            `Gemini temporarily unavailable. Retrying... (${attempt}/3)`
          );

          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          throw error;
        }
      }
    }

    const text = response.text;

    if (!text) {
      throw new Error('Invalid Gemini response');
    }

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw error;
  }
};

module.exports = {
  callGemini,
};