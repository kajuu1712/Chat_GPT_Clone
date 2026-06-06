import "dotenv/config";

const getOpenaiApiResponces = async (message) => {

  
  const API_KEY = process.env.OPENAI_API_KEY; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    });

    const data = await response.json();

    // Gemini returns errors inside a top-level 'error' object
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return "Sorry, I couldn't generate a response.";
    }

    // Parse Gemini's specific response structure
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Gemini fetch error:", err);
    return "Sorry, something went wrong.";
  }
};

export default getOpenaiApiResponces;