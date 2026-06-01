// ==========================================
// Supabase Edge Function: send-booking-email
// Sendet Buchungsbestätigungen via Gmail SMTP
// ==========================================

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { booking } = await req.json();

    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailPassword = Deno.env.get("GMAIL_APP_PASSWORD");

    if (!gmailUser || !gmailPassword) {
      throw new Error("Gmail-Zugangsdaten nicht konfiguriert.");
    }

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: gmailUser,
          password: gmailPassword,
        },
      },
    });

    const dateObj = new Date(booking.booking_date + "T00:00:00");
    const formattedDate = dateObj.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = booking.booking_time.substring(0, 5);

    const downloadUrl = "https://www.buchdennikolaus.de/documents/nikolaus-formular.docx";

    const userHtml = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
<tr>
<td style="background-color:#f05a00;padding:28px 24px;text-align:center;">
<h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">Buchungsbest&#228;tigung</h1>
</td>
</tr>
<tr>
<td style="padding:28px 24px;">
<p style="margin:0 0 16px 0;font-size:16px;color:#2c2c2c;">Liebe Familie ${booking.last_name},</p>
<p style="margin:0 0 24px 0;font-size:15px;color:#444444;">vielen Dank f&#252;r Ihre Buchung! Wir freuen uns auf den Nikolaus-Besuch bei Ihnen.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="border-left:4px solid #f05a00;background-color:#f9f9f9;padding:20px;margin-bottom:24px;">
<tr><td>
<h2 style="margin:0 0 16px 0;font-size:18px;color:#2c2c2c;">Ihr Termin</h2>
<p style="margin:4px 0;font-size:14px;color:#444444;"><strong>Datum:</strong> ${formattedDate}</p>
<p style="margin:4px 0;font-size:14px;color:#444444;"><strong>Uhrzeit:</strong> ${formattedTime} Uhr</p>
<p style="margin:4px 0;font-size:14px;color:#444444;"><strong>Dauer:</strong> ${booking.duration} Minuten</p>
<p style="margin:4px 0;font-size:14px;color:#444444;"><strong>Anzahl Kinder:</strong> ${booking.num_children}</p>
</td></tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f05a00;background-color:#fff5ee;border-radius:4px;padding:20px;margin-bottom:24px;">
<tr><td>
<h3 style="margin:0 0 12px 0;font-size:15px;color:#f05a00;">Wichtig: Nikolaus-Formular</h3>
<p style="margin:0 0 16px 0;font-size:14px;color:#444444;">Bitte laden Sie das Nikolaus-Formular herunter, f&#252;llen Sie es aus und senden Sie es <strong>bis sp&#228;testens 01.12.2026</strong> per E-Mail an: <a href="mailto:buchdennikolaus@gmail.com" style="color:#f05a00;">buchdennikolaus@gmail.com</a></p>
<a href="${downloadUrl}" style="display:inline-block;background-color:#f05a00;color:#ffffff;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;font-size:14px;">Formular herunterladen</a>
</td></tr>
</table>
<p style="margin:0 0 8px 0;font-size:14px;color:#444444;">Bei Fragen stehen wir gerne zur Verf&#252;gung.</p>
<p style="margin:0;font-size:14px;color:#444444;">Mit freundlichen Gr&#252;&#223;en,<br><strong>Kolpingsfamilie Eichenau</strong></p>
</td>
</tr>
<tr>
<td style="background-color:#f4f4f4;padding:16px 24px;text-align:center;">
<p style="margin:0;font-size:12px;color:#999999;">Kolpingsfamilie Eichenau | buchdennikolaus@gmail.com</p>
</td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    await client.send({
      from: gmailUser,
      to: booking.email,
      subject: "Buchungsbestätigung - Nikolaus-Besuch Kolpingsfamilie Eichenau",
      html: userHtml,
    });

    const adminHtml = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;padding:20px;">
<h2 style="color:#f05a00;">Neue Buchung eingegangen</h2>
<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
<tr style="background-color:#f9f9f9;"><td style="border:1px solid #ddd;"><strong>Name</strong></td><td style="border:1px solid #ddd;">${booking.first_name} ${booking.last_name}</td></tr>
<tr><td style="border:1px solid #ddd;"><strong>Adresse</strong></td><td style="border:1px solid #ddd;">${booking.address}, ${booking.zip} ${booking.city}</td></tr>
<tr style="background-color:#f9f9f9;"><td style="border:1px solid #ddd;"><strong>E-Mail</strong></td><td style="border:1px solid #ddd;">${booking.email}</td></tr>
<tr><td style="border:1px solid #ddd;"><strong>Telefon</strong></td><td style="border:1px solid #ddd;">${booking.phone}</td></tr>
<tr style="background-color:#f9f9f9;"><td style="border:1px solid #ddd;"><strong>Datum</strong></td><td style="border:1px solid #ddd;">${formattedDate}</td></tr>
<tr><td style="border:1px solid #ddd;"><strong>Uhrzeit</strong></td><td style="border:1px solid #ddd;">${formattedTime} Uhr</td></tr>
<tr style="background-color:#f9f9f9;"><td style="border:1px solid #ddd;"><strong>Dauer</strong></td><td style="border:1px solid #ddd;">${booking.duration} Minuten</td></tr>
<tr><td style="border:1px solid #ddd;"><strong>Kinder</strong></td><td style="border:1px solid #ddd;">${booking.num_children}</td></tr>
${booking.notes ? `<tr style="background-color:#f9f9f9;"><td style="border:1px solid #ddd;"><strong>Hinweise</strong></td><td style="border:1px solid #ddd;">${booking.notes}</td></tr>` : ""}
</table>
</body>
</html>`;

    await client.send({
      from: gmailUser,
      to: gmailUser,
      subject: `Neue Buchung: ${booking.first_name} ${booking.last_name} - ${formattedDate} ${formattedTime}`,
      html: adminHtml,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const err = error as Error;
    console.error("E-Mail Fehler:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});