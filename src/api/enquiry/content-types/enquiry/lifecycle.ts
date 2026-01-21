export default {
  // Use 'any' for the event to avoid missing type declaration errors
  async afterCreate(event: any) {
    const { result } = event;

    try {
      // @ts-ignore
      await strapi.plugins['email'].services.email.send({
        to: 'your-admin-email@gmail.com', 
        from: 'no-reply@graingrid.com',
        subject: `New Inquiry: ${result.Subject}`,
        html: `
          <div style="font-family: sans-serif; border: 1px solid #eee; padding: 40px; max-width: 600px; margin: auto; border-radius: 10px;">
            <h2 style="color: #ea580c; text-transform: uppercase; letter-spacing: 2px;">New GrainGrid Inquiry</h2>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p><strong>Customer Name:</strong> ${result.Name}</p>
            <p><strong>Customer Email:</strong> ${result.Email}</p>
            <p><strong>Subject:</strong> ${result.Subject}</p>
            <div style="background: #fdfdfd; padding: 20px; border-left: 4px solid #ea580c; margin-top: 20px;">
              <p><strong>Message:</strong></p>
              <p style="line-height: 1.6; color: #333;">${result.Message}</p>
            </div>
            <p style="font-size: 10px; color: #aaa; margin-top: 30px; text-transform: uppercase;">Sent via GrainGrid Portfolio System</p>
          </div>
        `,
      });
      console.log('Inquiry email sent successfully.');
    } catch (err) {
      console.error("Email sending failed. Ensure your SMTP settings are correct in plugins.ts:", err);
    }
  },
};