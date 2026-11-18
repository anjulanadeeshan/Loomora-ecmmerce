const brevo = require('@getbrevo/brevo');

// Brevo API Client (lazy initialization)
let apiInstance = null;
let sendersApiInstance = null;
let senderValidationPromise = null;

// Initialize Brevo API (called after environment variables are loaded)
const initializeBrevoAPI = () => {
    if (apiInstance) return apiInstance; // Already initialized
    
    console.log('Email Service Configuration:');
    console.log('- API Key exists:', !!process.env.BREVO_API_KEY);
    console.log('- API Key length:', process.env.BREVO_API_KEY?.length);
    console.log('- From Address:', process.env.EMAIL_FROM_ADDRESS);
    console.log('- Frontend URL:', process.env.FRONTEND_URL);

    if (!process.env.BREVO_API_KEY) {
        console.error('✗ BREVO_API_KEY is not set!');
        throw new Error('BREVO_API_KEY environment variable is required');
    }

    if (!process.env.EMAIL_FROM_ADDRESS) {
        throw new Error('EMAIL_FROM_ADDRESS environment variable is required');
    }

    apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
        brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
    );

    sendersApiInstance = new brevo.SendersApi();
    sendersApiInstance.setApiKey(
        brevo.SendersApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
    );
    console.log('✓ Brevo API initialized successfully');
    
    return apiInstance;
};

const validateConfiguredSender = async () => {
    initializeBrevoAPI();

    if (!senderValidationPromise) {
        senderValidationPromise = sendersApiInstance.getSenders()
            .then(({ body }) => {
                const configuredAddress = process.env.EMAIL_FROM_ADDRESS.trim().toLowerCase();
                const sender = body.senders?.find(
                    (candidate) => candidate.email.toLowerCase() === configuredAddress
                );

                if (!sender?.active) {
                    throw new Error(
                        'EMAIL_FROM_ADDRESS must match an active, verified sender in Brevo'
                    );
                }

                return sender;
            })
            .catch((error) => {
                senderValidationPromise = null;
                throw error;
            });
    }

    return senderValidationPromise;
};

// Send Password Reset Email using Brevo API
const sendPasswordResetEmail = async (email, verificationCode, userName) => {
    try {
        const api = initializeBrevoAPI(); // Initialize API if not already done
        await validateConfiguredSender();
        console.log(`📧 Attempting to send password reset email to: ${email}`);
        
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        
        sendSmtpEmail.subject = 'Password Reset Request - Loomora';
        sendSmtpEmail.to = [{ email: email, name: userName || 'User' }];
        sendSmtpEmail.sender = { 
            name: process.env.EMAIL_FROM_NAME || 'Loomora',
            email: process.env.EMAIL_FROM_ADDRESS || 'noreply@loomora.com'
        };
        
        sendSmtpEmail.htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
                    .code-box { background-color: #fff; border: 2px dashed #7d263d; padding: 18px; margin: 20px 0; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 10px; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Loomora</h1>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>Hello ${userName || 'User'},</p>
                        <p>We received a request to reset your password. Enter this verification code:</p>
                        
                        <div class="code-box">${verificationCode}</div>
                        
                        <p><strong>Important:</strong></p>
                        <ul>
                            <li>This code will expire in 10 minutes</li>
                            <li>Do not share this code with anyone</li>
                            <li>If you didn't request this reset, please ignore this email</li>
                        </ul>
                        
                        <p>Best regards,<br>The Loomora Team</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Loomora. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const { body } = await api.sendTransacEmail(sendSmtpEmail);
        const messageId = body?.messageId;

        if (!messageId) {
            throw new Error('Brevo accepted the request without returning a message ID');
        }
        console.log('Password reset email queued by Brevo:', messageId);
        return { success: true, messageId };

    } catch (error) {
        console.error('✗ Brevo API error details:');
        console.error('  Error name:', error.name);
        console.error('  Error message:', error.message);
        console.error('  Error response:', error.response?.text || error.response?.body || 'No response');
        console.error('  Full error:', JSON.stringify(error, null, 2));
        throw error;
    }
};

// Send Welcome Email
const sendWelcomeEmail = async (email, userName) => {
    try {
        const api = initializeBrevoAPI(); // Initialize API if not already done
        await validateConfiguredSender();
        
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        
        sendSmtpEmail.subject = 'Welcome to Loomora! 🎉';
        sendSmtpEmail.to = [{ email: email, name: userName }];
        sendSmtpEmail.sender = { 
            name: process.env.EMAIL_FROM_NAME, 
            email: process.env.EMAIL_FROM_ADDRESS 
        };
        
        sendSmtpEmail.htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
                    .button { display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header"><h1>Welcome to Loomora!</h1></div>
                    <div class="content">
                        <h2>Hello ${userName}! 👋</h2>
                        <p>Thank you for joining Loomora!</p>
                        <center><a href="${process.env.FRONTEND_URL}" class="button">Start Shopping</a></center>
                    </div>
                </div>
            </body>
            </html>
        `;

        const { body } = await api.sendTransacEmail(sendSmtpEmail);
        const messageId = body?.messageId;

        if (!messageId) {
            throw new Error('Brevo accepted the request without returning a message ID');
        }
        console.log('Welcome email queued by Brevo:', messageId);
        return { success: true, messageId };

    } catch (error) {
        console.error('✗ Welcome email error:', error);
        return { success: false, error: error.message };
    }
};

const sendNewsletterWelcomeEmail = async (email, unsubscribeUrl) => {
    const api = initializeBrevoAPI();
    await validateConfiguredSender();
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173')
        .replace(/\/$/, '');

    const message = new brevo.SendSmtpEmail();
    message.subject = 'Welcome to the Loomora List';
    message.to = [{ email }];
    message.sender = {
        name: process.env.EMAIL_FROM_NAME || 'Loomora',
        email: process.env.EMAIL_FROM_ADDRESS
    };
    message.htmlContent = `
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Welcome to Loomora</title>
        </head>
        <body style="margin:0;background:#f5f1eb;color:#1d1a17;font-family:Arial,sans-serif;">
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
                New edits, private offers and thoughtful wardrobe inspiration from Loomora.
            </div>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1eb;padding:32px 16px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fffdf9;border-radius:24px;overflow:hidden;border:1px solid #e1d8cc;">
                            <tr>
                                <td style="background:#681f34;padding:34px 40px;color:#ffffff;">
                                    <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#dfbd91;">Loomora private notes</p>
                                    <h1 style="margin:0;font-family:Georgia,serif;font-size:42px;line-height:1.05;font-weight:400;">A little more style in your inbox.</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:38px 40px;">
                                    <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;font-weight:400;">You are on the list.</h2>
                                    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#5f5851;">Welcome to Loomora. You will receive new edits, private offers and thoughtful wardrobe inspiration, sent only when there is something worth sharing.</p>
                                    <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#5f5851;">Until then, explore our latest collection and find your next signature piece.</p>
                                    <a href="${frontendUrl}/collection" style="display:inline-block;border-radius:999px;background:#1d1a17;padding:14px 26px;color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Explore the collection</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="border-top:1px solid #e1d8cc;padding:24px 40px;font-size:12px;line-height:1.6;color:#8c847b;">
                                    <p style="margin:0 0 8px;">You received this email because you subscribed to the Loomora list.</p>
                                    <a href="${unsubscribeUrl}" style="color:#681f34;">Unsubscribe</a>
                                    <span style="padding:0 8px;">|</span>
                                    <span>&copy; ${new Date().getFullYear()} Loomora</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    const { body } = await api.sendTransacEmail(message);
    const messageId = body?.messageId;

    if (!messageId) {
        throw new Error('Brevo accepted the request without returning a message ID');
    }

    console.log('Newsletter welcome email queued by Brevo:', messageId);
    return { success: true, messageId };
};

module.exports = {
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendNewsletterWelcomeEmail
};
