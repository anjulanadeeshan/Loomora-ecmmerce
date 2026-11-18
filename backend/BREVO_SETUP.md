# Brevo Email Integration Setup Guide

> This project sends email through the Brevo REST API in `config/emailService.js`.
> It requires a Brevo API key and an active, verified sender. An SMTP key is not
> required unless the implementation is changed to use Nodemailer/SMTP.

## Step 1: Create a Brevo Account

1. Go to [Brevo](https://www.brevo.com/) (formerly Sendinblue)
2. Click **Sign Up** (Free plan available - 300 emails/day)
3. Complete registration and verify your email

## Step 2: Create an API Key

1. **Login to Brevo Dashboard**
2. Click on your profile (top right) → **SMTP & API**
3. Navigate to **API keys & MCP**
4. Generate an API key and copy it when Brevo displays it

## Step 3: Configure Your .env File

Update your `.env` file with the credentials:

```env
# Brevo Email Configuration
BREVO_API_KEY=xkeysib-your-actual-api-key-here
EMAIL_FROM_ADDRESS=your-verified-sender@example.com
EMAIL_FROM_NAME=Loomora
FRONTEND_URL=http://localhost:5173
```

### Important Notes:

- **BREVO_API_KEY**: The API key from Brevo's **API keys & MCP** tab
- **EMAIL_FROM_ADDRESS**: Must exactly match an active, verified Brevo sender
- **EMAIL_FROM_NAME**: Display name in emails
- **FRONTEND_URL**: Your frontend URL (for reset links)

## Step 4: Verify Sender Email (For Production)

For production use, verify your sending domain:

1. Go to **Senders** in Brevo dashboard
2. Click **Add a sender**
3. Enter email address (e.g., noreply@yourdomain.com)
4. Verify via email confirmation

## Step 5: Test Email Sending

Restart your backend server:

```bash
cd backend
npm start
```

Test the password reset:
1. Go to frontend `/forgot-password`
2. Enter a registered email
3. Check your email inbox for reset instructions

## Step 6: Monitor Email Activity

- **Dashboard**: View sent emails and delivery rates
- **Logs**: Check for any delivery issues
- **Statistics**: Monitor open rates and clicks

## Brevo Free Plan Limits

- ✅ 300 emails per day
- ✅ Unlimited contacts
- ✅ SMTP relay
- ✅ Email templates
- ✅ Real-time statistics

For higher volume, upgrade to paid plans.

## Troubleshooting

### Issue: "Authentication failed"
**Solution:** 
- Verify SMTP password is correct (not login password)
- Regenerate SMTP key if needed

### Issue: Emails going to spam
**Solution:**
- Verify sender domain
- Add SPF and DKIM records to your domain
- Use a verified email address

### Issue: "Sender is not valid"
**Solution:**
- Open **Settings > Senders, Domains & Dedicated IPs** in Brevo
- Verify the address configured as `EMAIL_FROM_ADDRESS`
- Make sure the configured address exactly matches the active sender

## Optional alternative: SMTP

The current project already uses the Brevo API. Only configure SMTP if you
replace the API implementation with Nodemailer or another SMTP client. SMTP
authentication requires an SMTP key; the API key cannot be used as the SMTP
password.

The Brevo SDK used by the current implementation is installed with:
```bash
npm install @getbrevo/brevo
```

## Production Checklist

- [ ] Verify sender domain
- [ ] Set up SPF/DKIM records
- [ ] Use environment variables (never commit .env)
- [ ] Remove resetToken from API response
- [ ] Monitor email delivery rates
- [ ] Set up email templates in Brevo
- [ ] Configure bounce handling
- [ ] Add unsubscribe links (for marketing emails)

## Support

- Brevo Documentation: https://developers.brevo.com/
- Support: https://help.brevo.com/

---

**Your email service is now configured! 🎉**
