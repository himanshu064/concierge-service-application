// Import the Supabase Edge Runtime
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import nodemailer from "npm:nodemailer";

// Log a startup message
console.log("Email sending function initialized!");

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Allow requests from any domain
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
    "Content-Type": "application/json",
  };

  // Handle preflight (OPTIONS) request
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Parse the incoming request body
    const { email, subject, message } = await req.json();

    // Validate input
    if (!email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing email, subject, or message" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Configure the email transporter using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Replace with your email provider, e.g., SendGrid, Mailgun, etc.
      port: 465,
      auth: {
        user: "gs7788264@gmail.com", // Your email address
        pass: "flbrpkuluqokknmv", // App-specific password (not your actual password)
      },
      host: "smtp.gmail.com",
    });

    // Define the email options
    const mailOptions = {
      from: "gs7788264@gmail.com", // Sender email
      to: email, // Recipient email
      subject, // Email subject
      html: `<p>${message}</p>`, // Email body (HTML content)
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return a success response
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully!" }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    // Return an error response
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
