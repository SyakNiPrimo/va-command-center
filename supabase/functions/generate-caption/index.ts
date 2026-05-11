const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function cleanCaption(text: string) {
  return String(text || "")
    .replace(/[\u2014\u2013-]/g, ",")
    .replace(/#[^\s#]+/g, (tag, offset, full) => {
      const tags = full.slice(0, offset).match(/#[^\s#]+/g) || [];
      return tags.length < 5 ? tag : "";
    })
    .trim();
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
    const prompt = `Create an Instagram real estate caption using these rules:
- Status in ALL CAPS
- Full property address on first line
- No hyphens or em dashes
- Max 5 hashtags
- Always include #arizona #RealEstate #TheJakobovGroup
- Use only the agent Instagram handle and @thejakobovgroup in the Exclusively listed by line
- Polished modern Arizona luxury real estate tone

Listing data:
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

    return new Response(JSON.stringify({ ok: true, caption: cleanCaption(text), fallback: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
