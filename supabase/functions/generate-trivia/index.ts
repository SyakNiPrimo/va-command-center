const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function cleanCopy(text: string) {
  return String(text || "").replace(/[\u2014\u2013-]/g, ",").trim();
}

function parseTriviaOutput(text: string, fallback: any) {
  const cleaned = cleanCopy(text);
  const slide1 = cleaned.match(/Slide 1:\s*([\s\S]*?)(?:Slide 2:|Caption:|$)/i)?.[1]?.trim();
  const slide2 = cleaned.match(/Slide 2:\s*([\s\S]*?)(?:Caption:|$)/i)?.[1]?.trim();
  const caption = cleaned.match(/Caption:\s*([\s\S]*)/i)?.[1]?.trim();
  return {
    ...fallback,
    slide1Text: slide1 || fallback.slide1Text,
    slide2Text: slide2 || fallback.slide2Text,
    caption: caption || fallback.caption,
    hashtags: "#arizona #RealEstate #TheJakobovGroup",
    status: "Drafting"
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") throw new Error("Method not allowed.");
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini";
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing in Supabase Edge Function secrets.");

    const body = await req.json();
    const prompt = `Create a weekly Arizona trivia social media carousel package for The Jakobov Group.

Rules:
- 2 slide carousel
- Slide 1 is a DID YOU KNOW style hook
- Slide 2 explains why this makes Arizona attractive to live in or move to
- Caption is polished, approachable, Arizona real estate friendly
- No hyphens or em dashes
- Max 5 hashtags
- Always include #arizona #RealEstate #TheJakobovGroup
- Do not mention automated tools

Return exactly:
Slide 1:
...

Slide 2:
...

Caption:
...

Current draft:
${JSON.stringify(body, null, 2)}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, input: prompt, temperature: 0.7 })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "OpenAI API error.");
    const text = data.output_text || data.output?.flatMap((item: any) => item.content || []).map((item: any) => item.text || "").join("\n") || "";

    return new Response(JSON.stringify({ ok: true, post: parseTriviaOutput(text, body) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
