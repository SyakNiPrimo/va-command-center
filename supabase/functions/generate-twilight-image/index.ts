const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function dataUrlToFileParts(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i);
  if (!match) throw new Error("Upload a JPG, PNG, or WEBP image.");
  const mimeType = match[1].toLowerCase() === "image/jpg" ? "image/jpeg" : match[1].toLowerCase();
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return { bytes, mimeType };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") throw new Error("Method not allowed.");
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_IMAGE_MODEL") || "gpt-image-1.5";
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing in Supabase Edge Function secrets.");

    const body = await req.json();
    const imageDataUrl = String(body.imageDataUrl || "");
    const prompt = String(body.prompt || "");
    if (!imageDataUrl) throw new Error("Missing imageDataUrl.");
    if (!prompt) throw new Error("Missing prompt.");

    const { bytes, mimeType } = dataUrlToFileParts(imageDataUrl);
    const extension = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
    const formData = new FormData();
    formData.append("model", model);
    formData.append("prompt", prompt);
    formData.append("image", new File([bytes], `listing-exterior.${extension}`, { type: mimeType }));
    formData.append("size", "1024x1536");
    formData.append("output_format", "jpeg");
    formData.append("quality", "high");

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "OpenAI image edit error.");
    const b64Json = data.data?.[0]?.b64_json;
    if (!b64Json) throw new Error("OpenAI did not return an edited image.");

    return new Response(JSON.stringify({
      ok: true,
      b64Json,
      imageDataUrl: `data:image/jpeg;base64,${b64Json}`,
      model
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
