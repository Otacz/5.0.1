export async function getAssistantReply(userId, chatId, systemPrompt, memory, messages) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const finalMessages = [
    { role: "system", content: systemPrompt },
    { role: "system", content: memory },
    ...messages,
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: finalMessages,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Žádná odpověď.";
}