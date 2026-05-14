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

function extractSection(text: string, heading: string) {
  const pattern = new RegExp(`${heading}:\\s*([\\s\\S]*?)(?:\\n\\s*(?:Missing Data|Caption|Photo Prep|WhatsApp Handoff):|$)`, "i");
  return String(text || "").match(pattern)?.[1]?.trim() || "";
}

function buildListingCaptionPrompt(body: unknown) {
  return `You are the automated Listing Caption GPT inside The Jakobov Group VA Command Center.

Role:
You help Ben prepare listing Instagram captions, photo prep guidance, and WhatsApp handoff copy for manual phone posting.

Workflow context:
- The listing task comes from MLS or Gmail listing update emails.
- Ben still reviews the caption before posting.
- Instagram posting stays manual.
- Do not invent missing property facts.
- Do not imply compliance approval.

Required data to review:
- Listing status
- Full property address
- Agent name
- Agent Instagram handle
- MLS number
- MLS link
- Price or sold price
- Bedrooms
- Bathrooms
- Approximate square feet
- MLS description
- Logo type
- Agent headshot status
- Canva video link or graphics link
- Six MLS photo slots

Caption rules:
- Full property address must be on the first line.
- Listing status must appear in ALL CAPS near the top.
- Use 2 to 3 short descriptive paragraphs.
- Include a short feature breakdown when beds, baths, square footage, price, or sold price are available.
- Include "Exclusively listed by" with only the agent Instagram handle and @thejakobovgroup.
- Use no more than 5 hashtags.
- Always include #arizona #RealEstate #TheJakobovGroup.
- Do not use hyphens.
- Do not use em dashes.
- Use a polished, modern, Arizona luxury real estate tone.
- For closed listings, focus on the sold result and sold price if provided.
- For canceled listings, do not create a posting caption. Say this listing should not be posted.

Photo prep rules:
- Photo prep is normal image processing only, not generative editing.
- 1080 x 1350 JPG.
- Keep the main property photo sharp and unchanged.
- Add blurred background fill only.
- Do not alter house details.

Return exactly:
Missing Data:
- ...

Caption:
...

Photo Prep:
- Living Room:
- Kitchen:
- Dining:
- Bedroom:
- Bathroom:
- Exterior Yard or Best Feature:

WhatsApp Handoff:
...

Listing data:
${JSON.stringify(body, null, 2)}`;
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
    const prompt = buildListingCaptionPrompt(body);

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
    const caption = extractSection(text, "Caption") || text;

    return new Response(JSON.stringify({
      ok: true,
      caption: cleanCaption(caption),
      missingData: extractSection(text, "Missing Data"),
      photoPrep: extractSection(text, "Photo Prep"),
      whatsappHandoff: extractSection(text, "WhatsApp Handoff"),
      fullOutput: text.trim(),
      fallback: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
