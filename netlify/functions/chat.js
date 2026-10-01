export default async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Only POST requests are allowed." }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    const body = await req.json();

    const messages = Array.isArray(body.messages)
      ? body.messages
      : [];

    const safeMessages = messages
      .filter(
        (message) =>
          message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string"
      )
      .slice(-20)
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, 12000)
      }));

    if (
      !safeMessages.length ||
      !safeMessages.some((message) => message.role === "user")
    ) {
      return new Response(
        JSON.stringify({ error: "Please send a message." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        reply:
          "Vedant AI backend is connected. We will add the free AI provider in the next step."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Vedant AI error:", error);

    return new Response(
      JSON.stringify({
        error: "Sorry, Vedant AI could not process that request."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
