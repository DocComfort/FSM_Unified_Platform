// deno-lint-ignore-file no-explicit-any
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const buildTwiml = (dialNumber: string | null) => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Connecting your call from the Field Service Management system.</Say>
  <Dial timeout="30" record="record-from-answer">
    ${dialNumber ? `<Number>${dialNumber}</Number>` : "<Hangup/>"}
  </Dial>
</Response>`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const toNumber = url.searchParams.get("To");

    if (!toNumber) {
      return new Response(buildTwiml(null), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/xml",
        },
      });
    }

    return new Response(buildTwiml(toNumber), {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Error generating TwiML:", error);

    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Sorry, there was an error connecting your call.</Say>
  <Hangup/>
</Response>`;

    return new Response(fallback, {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/xml",
      },
    });
  }
});