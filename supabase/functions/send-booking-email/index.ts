// ==========================================
// Supabase Edge Function: send-booking-email
// Sendet Buchungsbestätigungen via Gmail SMTP
// ==========================================
// Deployment: supabase functions deploy send-booking-email
// Secrets setzen:
//   supabase secrets set GMAIL_USER=buchdennikolaus@gmail.com
//   supabase secrets set GMAIL_APP_PASSWORD=<Ihr-App-Passwort>

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // CORS preflight
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

    // Datum formatieren
    const dateObj = new Date(booking.booking_date + "T00:00:00");
    const formattedDate = dateObj.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = booking.booking_time.substring(0, 5);

    // E-Mail an den Nutzer senden
    await client.send({
      from: gmailUser,
      to: booking.email,
      subject: "Buchungsbestätigung - Nikolaus-Besuch Kolping",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f05a00; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">Buchungsbestätigung</h1>
          </div>
          
          <div style="padding: 24px; background-color: #f9f9f9;">
            <p>Liebe Familie ${booking.last_name},</p>
            <p>vielen Dank für Ihre Buchung! Wir freuen uns auf den Nikolaus-Besuch bei Ihnen.</p>
            
            <div style="background-color: white; border-left: 4px solid #f05a00; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <h2 style="margin: 0 0 16px 0; color: #2c2c2c;">Ihr Termin</h2>
              <p style="margin: 4px 0;"><strong>Datum:</strong> ${formattedDate}</p>
              <p style="margin: 4px 0;"><strong>Uhrzeit:</strong> ${formattedTime} Uhr</p>
              <p style="margin: 4px 0;"><strong>Dauer:</strong> ${booking.duration} Minuten</p>
              <p style="margin: 4px 0;"><strong>Anzahl Kinder:</strong> ${booking.num_children}</p>
            </div>
            
            <div style="background-color: #fff5ee; border: 1px solid #f05a00; padding: 16px; border-radius: 4px;">
              <h3 style="margin: 0 0 8px 0; color: #f05a00;">⚠️ Wichtig: Nikolaus-Formular</h3>
              <p style="margin: 0;">
                Bitte laden Sie das Nikolaus-Formular herunter, füllen Sie es aus und senden Sie es 
                <strong>bis spätestens 01.12.2026</strong> per E-Mail an:
                <a href="mailto:buchdennikolaus@gmail.com">buchdennikolaus@gmail.com</a>
              </p>
            </div>
            
            <p style="margin-top: 24px;">Bei Fragen stehen wir gerne zur Verfügung.</p>
            <p>Mit freundlichen Grüßen,<br>Ihre Kolpingsfamilie</p>
          </div>
          
          <div style="padding: 16px; text-align: center; color: #666; font-size: 12px;">
            <p>Kolpingsfamilie | buchdennikolaus@gmail.com</p>
          </div>
        </div>
      `,
    });

    // Interne Benachrichtigung an Admin
    await client.send({
      from: gmailUser,
      to: gmailUser,
      subject: `Neue Buchung: ${booking.first_name} ${booking.last_name} - ${formattedDate} ${formattedTime}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Neue Buchung eingegangen</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${booking.first_name} ${booking.last_name}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Adresse</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${booking.address}, ${booking.zip} ${booking.city}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>E-Mail</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${booking.email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefon</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${booking.phone}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Datum</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formattedDate}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Uhrzeit</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formattedTime} Uhr</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Dauer</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${booking.duration} Minuten</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Kinder</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${booking.num_children}</td></tr>
            ${booking.notes ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Hinweise</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${booking.notes}</td></tr>` : ""}
          </table>
        </div>
      `,
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