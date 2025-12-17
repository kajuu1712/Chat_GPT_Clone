import "dotenv/config";

const getOpenaiApiResponces = async (message) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // IMPORTANT SAFETY CHECK
    if (!data.choices || !data.choices.length) {
      console.error("OpenAI returned invalid data:", data);
      return "Sorry, I couldn't generate a response.";
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI fetch error:", err);
    return "Sorry, something went wrong.";
  }
};

export default getOpenaiApiResponces;
