const ccav = require('./ccavutil.js');
const qs = require('querystring');

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Extract configurations from env or use the user's provided real credentials as reliable fallback
    const merchantId = process.env.CCAVENUE_MERCHANT_ID || '4445524';
    const workingKey = process.env.CCAVENUE_WORKING_KEY || 'AEE54FF9EA969DED8B505C982FC74CEA';
    const algorithm = process.env.CCAVENUE_WORKING_KEY_ALGORITHM || 'aes-128-cbc';
    const isSandbox = (process.env.CCAVENUE_SANDBOX === 'true');

    // Select dynamic access code depending on host URL to prevent multi-domain mismatches
    const host = req.headers.host || 'www.arkmanagement.com';
    let accessCode = process.env.CCAVENUE_ACCESS_CODE;
    
    if (!accessCode) {
        // Default fallbacks based on URL domains shared by user
        if (host.includes('localhost') || host.includes('vercel.app')) {
            // Use the trailing slash version as primary standard fallback
            accessCode = 'AVTA92NE51BK54ATKB'; 
        } else {
            accessCode = 'AVTA92NE51BK54ATKB'; // standard prod fallback
        }
    }

    // Determine secure request action URL
    const gatewayUrl = isSandbox
        ? 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction'
        : 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';

    try {
        // Parse request body parameters
        const body = req.body || {};
        const amount = body.amount || '1.00';
        const billingName = body.billing_name || 'Guest Customer';
        const billingEmail = body.billing_email || '';
        const billingTel = body.billing_tel || '';
        const serviceDesc = body.service_desc || 'Agency Services';

        // Auto-generate transaction ID & unique Order ID
        const tid = Date.now().toString();
        const orderId = `RGM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Dynamic base URLs for redirects
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const redirectUrl = process.env.CCAVENUE_REDIRECT_URL || `${protocol}://${host}/api/ccavenue-response`;
        const cancelUrl = process.env.CCAVENUE_CANCEL_URL || `${protocol}://${host}/api/ccavenue-response`;

        // CCAvenue expects a flat query-string of parameters
        const paymentParams = {
            tid: tid,
            merchant_id: merchantId,
            order_id: orderId,
            amount: parseFloat(amount).toFixed(2),
            currency: 'INR',
            redirect_url: redirectUrl,
            cancel_url: cancelUrl,
            language: 'EN',
            billing_name: billingName,
            billing_email: billingEmail,
            billing_tel: billingTel,
            merchant_param1: serviceDesc, // Store payment purpose
            merchant_param2: 'Web Gateway Checkout', // Tracking source
        };

        // Convert parameters to standard url-encoded string
        const paramString = qs.stringify(paymentParams);

        // Encrypt the parameters using our helper utility
        const encRequest = ccav.encrypt(paramString, workingKey, algorithm);

        // Generate auto-submitting HTML form
        const redirectionForm = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Redirecting to CCAvenue Secure Payment Gateway...</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    background-color: #f4f7f6;
                    color: #1a1a1a;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .loader-card {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    text-align: center;
                    max-width: 400px;
                }
                .spinner {
                    border: 4px solid rgba(230, 57, 70, 0.1);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border-left-color: #e63946;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 25px;
                }
                h2 { margin-bottom: 10px; font-size: 1.4rem; color: #0a255c; }
                p { color: #666; font-size: 0.95rem; margin-bottom: 0; }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="loader-card">
                <div class="spinner"></div>
                <h2>Securing Connection...</h2>
                <p>Redirecting you to CCAvenue Secure Payment Gateway. Please do not refresh or close this page.</p>
            </div>

            <form id="ccavForm" method="post" name="redirect" action="${gatewayUrl}">
                <input type="hidden" name="encRequest" id="encRequest" value="${encRequest}">
                <input type="hidden" name="access_code" id="access_code" value="${accessCode}">
            </form>

            <script type="text/javascript">
                document.getElementById('ccavForm').submit();
            </script>
        </body>
        </html>
        `;

        // Send HTML response that auto-submits
        res.status(200).setHeader('Content-Type', 'text/html').send(redirectionForm);

    } catch (error) {
        console.error("Error creating CCAvenue checkout request:", error);
        res.status(500).json({
            success: false,
            error: 'Failed to initiate secure payment gateway connection',
            details: error.message
        });
    }
};
