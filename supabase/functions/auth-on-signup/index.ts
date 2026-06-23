import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { user } = await req.json();
    const email = user?.email;
    const name = user?.user_metadata?.full_name || "there";

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Missing email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Flavours of Palnadu <noreply@flavoursofpalnadu.com>",
        to: email,
        subject: "Welcome to Flavours of Palnadu!",
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="background:#0a3d2e; padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-family:Georgia,serif; font-size:24px; font-weight:bold;">Flavours of Palnadu</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px; color:#1a1a1a; font-family:Arial,sans-serif; font-size:20px; font-weight:bold;">Welcome, ${name}!</h2>
              <p style="margin:0 0 16px; color:#4a4a4a; font-family:Arial,sans-serif; font-size:15px; line-height:1.6;">
                Thank you for joining Flavours of Palnadu. We're thrilled to have you!
              </p>
              <p style="margin:0 0 24px; color:#4a4a4a; font-family:Arial,sans-serif; font-size:15px; line-height:1.6;">
                Please verify your email address to unlock your account and start exploring authentic tastes from Palnadu.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${Deno.env.get("SITE_URL") || "https://flavoursofpalnadu.com"}/login" style="display:inline-block; background:#0a3d2e; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:8px; font-family:Arial,sans-serif; font-size:15px; font-weight:600;">Sign In to Your Account</a>
                  </td>
                </tr>
              </table>
              <p style="margin:32px 0 0; color:#9a9a9a; font-family:Arial,sans-serif; font-size:13px; line-height:1.5;">
                If you didn't create this account, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb; padding:20px 40px; text-align:center;">
              <p style="margin:0; color:#9a9a9a; font-family:Arial,sans-serif; font-size:12px;">
                Flavours of Palnadu &bull; Authentic tastes from Palnadu
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      }),
    });

    if (!resendResp.ok) {
      const errText = await resendResp.text();
      return new Response(
        JSON.stringify({ error: `Resend API error: ${errText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
