// deno-lint-ignore-file no-explicit-any
// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

type NullableString = string | null;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();

    const callSid = (formData.get("CallSid") as NullableString)?.toString();
    const callStatus = (formData.get("CallStatus") as NullableString)?.toString();
    const callDuration = (formData.get("CallDuration") as NullableString)?.toString();
    const recordingUrl = (formData.get("RecordingUrl") as NullableString)?.toString();
    const toNumber = (formData.get("To") as NullableString)?.toString();
    const fromNumber = (formData.get("From") as NullableString)?.toString();

    if (!callSid) {
      return new Response("Missing CallSid", { status: 400, headers: corsHeaders });
    }

    const updates: Record<string, any> = {
      call_sid: callSid,
      call_status: callStatus ?? null,
      updated_at: new Date().toISOString(),
    };

    if (callDuration && !Number.isNaN(Number(callDuration))) {
      updates.call_duration = Number.parseInt(callDuration, 10);
    }

    if (recordingUrl) {
      updates.call_recording_url = recordingUrl;
    }

    const statusMessageParts: string[] = [];
    if (callStatus) {
      statusMessageParts.push(`Call status: ${callStatus}`);
    }
    if (callDuration) {
      statusMessageParts.push(`Duration: ${callDuration} seconds`);
    }
    if (fromNumber && toNumber) {
      statusMessageParts.push(`From ${fromNumber} to ${toNumber}`);
    }
    if (recordingUrl) {
      statusMessageParts.push(`Recording: ${recordingUrl}`);
    }

    if (statusMessageParts.length > 0) {
      updates.body = statusMessageParts.join(" | ");
    }

    if (callStatus === "completed") {
      updates.delivered_at = new Date().toISOString();
    }

    let { error: updateError, data: updatedRows } = await supabase
      .from("customer_communications")
      .update(updates)
      .eq("call_sid", callSid)
      .select("id");

    if (!updateError && updatedRows.length === 0) {
      const fallbackUpdates = {
        ...updates,
        body: statusMessageParts.join(" | ") || updates.body,
      };

      const fallback = await supabase
        .from("customer_communications")
        .update(fallbackUpdates)
        .like("body", `%${callSid}%`)
        .select("id");

      updateError = fallback.error;
    }

    if (updateError) {
      console.error("Error updating customer_communications", updateError);
    }

    return new Response("OK", { headers: corsHeaders });
  } catch (error) {
    console.error("Error processing Twilio call status", error);
    return new Response("Error", { status: 500, headers: corsHeaders });
  }
});
