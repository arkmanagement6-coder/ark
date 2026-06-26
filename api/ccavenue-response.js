const ccav = require('./ccavutil.js');
const qs = require('querystring');

module.exports = async (req, res) => {
    // CCAvenue sends the response via a POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const workingKey = process.env.CCAVENUE_WORKING_KEY || 'AEE54FF9EA969DED8B505C982FC74CEA';
    const algorithm = process.env.CCAVENUE_WORKING_KEY_ALGORITHM || 'aes-128-cbc';

    try {
        const body = req.body || {};
        const encResp = body.encResp;

        if (!encResp) {
            return res.status(400).send(renderSystemErrorPage("Missing Encryption Response (encResp)", "No payment response payload was received from the gateway. This typically happens if the endpoint was loaded directly rather than through a CCAvenue payment callback."));
        }

        // Decrypt payment parameters
        let decryptedString = '';
        try {
            decryptedString = ccav.decrypt(encResp, workingKey, algorithm);
        } catch (decryptError) {
            console.error("Cryptographic Decryption Failure:", decryptError);
            return res.status(500).send(renderSystemErrorPage(
                "Decryption Failed (Invalid Credentials)",
                "The payment response was received but could not be decrypted. This indicates a mismatch in the CCAvenue Working Key. Please make sure the CCAVENUE_WORKING_KEY environment variable matches your CCAvenue Dashboard precisely.",
                decryptError.message
            ));
        }

        // Parse decrypted query string
        const responseParams = qs.parse(decryptedString);

        // Retrieve transaction parameters
        const orderId = responseParams.order_id || 'N/A';
        const trackingId = responseParams.tracking_id || 'N/A';
        const bankRefNo = responseParams.bank_ref_no || 'N/A';
        const orderStatus = (responseParams.order_status || '').trim().toLowerCase(); // 'success', 'failure', 'aborted', etc.
        const failureMessage = responseParams.failure_message || 'No additional failure message provided.';
        const paymentMode = responseParams.payment_mode || 'N/A';
        const cardName = responseParams.card_name || 'N/A';
        const amount = responseParams.amount || '0.00';
        const billingName = responseParams.billing_name || 'Customer';
        const billingEmail = responseParams.billing_email || '';
        const billingTel = responseParams.billing_tel || '';
        const serviceDesc = responseParams.merchant_param1 || 'Digital Agency Services';

        // Check overall transaction state
        let isSuccess = false;
        let statusTitle = "Payment Failed";
        let statusColor = "#e63946"; // var(--secondary-red)
        let statusIcon = "fa-circle-xmark";
        let statusBadge = "Failed";

        if (orderStatus === 'success') {
            isSuccess = true;
            statusTitle = "Payment Successful";
            statusColor = "#2ec4b6"; // Emerald green
            statusIcon = "fa-circle-check";
            statusBadge = "Success";
        } else if (orderStatus === 'aborted') {
            statusTitle = "Payment Cancelled";
            statusColor = "#ff8c00"; // Orange
            statusIcon = "fa-circle-exclamation";
            statusBadge = "Cancelled";
        }

        const dateString = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });

        // Generate a highly premium, styled HTML receipt page
        const responsePage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${statusTitle} | Revanta Growth Media Secure Payment</title>
            
            <!-- Google Fonts -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
            
            <!-- FontAwesome Icons -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

            <style>
                :root {
                    --primary-blue: #0a255c;
                    --secondary-red: #e63946;
                    --bg-light: #f4f7f6;
                    --text-dark: #1a1a1a;
                    --white: #ffffff;
                }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: var(--bg-light);
                    color: var(--text-dark);
                    line-height: 1.6;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 30px 20px;
                }
                .receipt-container {
                    background: var(--white);
                    width: 100%;
                    max-width: 600px;
                    border-radius: 30px;
                    box-shadow: 0 20px 50px rgba(10, 37, 92, 0.08);
                    overflow: hidden;
                    position: relative;
                    animation: slideUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .status-header {
                    text-align: center;
                    padding: 45px 30px 30px;
                    color: var(--white);
                    position: relative;
                }
                .status-header.success {
                    background: linear-gradient(135deg, #0f3d3c, #134e4d);
                }
                .status-header.failed {
                    background: linear-gradient(135deg, #5c0f13, #7e1218);
                }
                .status-header.cancelled {
                    background: linear-gradient(135deg, #6b3e00, #915400);
                }
                .icon-wrapper {
                    font-size: 4.5rem;
                    margin-bottom: 20px;
                    display: inline-block;
                    animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards;
                    opacity: 0;
                    transform: scale(0.5);
                }
                @keyframes scaleIn {
                    to { opacity: 1; transform: scale(1); }
                }
                .status-header h1 {
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                    letter-spacing: -0.5px;
                }
                .status-badge {
                    display: inline-block;
                    padding: 6px 18px;
                    border-radius: 50px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    margin-top: 5px;
                }
                .receipt-body {
                    padding: 40px 35px;
                }
                .amount-display {
                    text-align: center;
                    margin-bottom: 35px;
                    border-bottom: 1px dashed rgba(0,0,0,0.1);
                    padding-bottom: 30px;
                }
                .amount-display span {
                    font-size: 0.95rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #777;
                    font-weight: 500;
                    display: block;
                    margin-bottom: 5px;
                }
                .amount-display h2 {
                    font-family: 'Outfit', sans-serif;
                    font-size: 2.8rem;
                    font-weight: 800;
                    color: var(--primary-blue);
                }
                .details-grid {
                    display: grid;
                    gap: 18px;
                    margin-bottom: 40px;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    font-size: 0.95rem;
                }
                .detail-label {
                    color: #777;
                    font-weight: 500;
                    min-width: 140px;
                }
                .detail-value {
                    text-align: right;
                    font-weight: 600;
                    color: var(--text-dark);
                    word-break: break-all;
                }
                .failure-desc-box {
                    background: rgba(230, 57, 70, 0.05);
                    border: 1px solid rgba(230, 57, 70, 0.15);
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 35px;
                }
                .failure-desc-box h4 {
                    color: var(--secondary-red);
                    font-weight: 700;
                    margin-bottom: 6px;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .failure-desc-box p {
                    font-size: 0.9rem;
                    color: #555;
                    line-height: 1.5;
                }
                .receipt-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 13px 28px;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }
                .btn-home {
                    background: var(--primary-blue);
                    color: var(--white);
                }
                .btn-home:hover {
                    background: #123780;
                    transform: translateY(-2px);
                }
                .btn-print {
                    border-color: #ddd;
                    background: var(--white);
                    color: #555;
                }
                .btn-print:hover {
                    background: #f8f9fa;
                    border-color: #ccc;
                    transform: translateY(-2px);
                }
                .btn-whatsapp {
                    background: #25d366;
                    color: var(--white);
                }
                .btn-whatsapp:hover {
                    background: #1ebe58;
                    transform: translateY(-2px);
                }
                .receipt-logo {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo-text {
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: var(--primary-blue);
                }
                .logo-text span {
                    color: var(--secondary-red);
                }

                @media print {
                    body { background: white; padding: 0; }
                    .receipt-container { box-shadow: none; border-radius: 0; max-width: 100%; }
                    .receipt-actions { display: none !important; }
                    .status-header { color: black !important; padding: 20px 0; border-bottom: 2px solid #333; }
                    .status-header.success, .status-header.failed, .status-header.cancelled { background: none !important; }
                    .icon-wrapper { color: black !important; font-size: 3rem; }
                    .status-badge { color: black !important; border-color: black !important; }
                    .amount-display h2 { color: black !important; }
                }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <div class="status-header ${isSuccess ? 'success' : orderStatus === 'aborted' ? 'cancelled' : 'failed'}">
                    <div class="icon-wrapper">
                        <i class="fa-solid ${isSuccess ? 'fa-circle-check' : orderStatus === 'aborted' ? 'fa-circle-exclamation' : 'fa-circle-xmark'}"></i>
                    </div>
                    <h1>${statusTitle}</h1>
                    <div class="status-badge">${statusBadge}</div>
                </div>

                <div class="receipt-body">
                    <div class="receipt-logo">
                        <div class="logo-text"><span>R</span>evanta <span>G</span>rowth <span>M</span>edia</div>
                    </div>

                    <div class="amount-display">
                        <span>Total Amount Paid</span>
                        <h2>₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                    </div>

                    ${!isSuccess ? `
                    <div class="failure-desc-box">
                        <h4><i class="fa-solid fa-triangle-exclamation"></i> Transaction Info</h4>
                        <p>${orderStatus === 'aborted' ? 'The payment transaction was cancelled or aborted by the user.' : failureMessage}</p>
                    </div>
                    ` : ''}

                    <div class="details-grid">
                        <div class="detail-row">
                            <span class="detail-label">Service/Purpose</span>
                            <span class="detail-value">${serviceDesc}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Billing Customer</span>
                            <span class="detail-value">${billingName}</span>
                        </div>
                        ${billingEmail ? `
                        <div class="detail-row">
                            <span class="detail-label">Email Address</span>
                            <span class="detail-value">${billingEmail}</span>
                        </div>
                        ` : ''}
                        ${billingTel ? `
                        <div class="detail-row">
                            <span class="detail-label">Phone Number</span>
                            <span class="detail-value">${billingTel}</span>
                        </div>
                        ` : ''}
                        <div class="detail-row">
                            <span class="detail-label">Order Reference ID</span>
                            <span class="detail-value" style="font-family: monospace;">${orderId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">CCAvenue Tracking ID</span>
                            <span class="detail-value" style="font-family: monospace;">${trackingId}</span>
                        </div>
                        ${bankRefNo !== 'N/A' && bankRefNo ? `
                        <div class="detail-row">
                            <span class="detail-label">Bank Reference No</span>
                            <span class="detail-value" style="font-family: monospace;">${bankRefNo}</span>
                        </div>
                        ` : ''}
                        ${paymentMode !== 'N/A' && paymentMode ? `
                        <div class="detail-row">
                            <span class="detail-label">Payment Channel</span>
                            <span class="detail-value">${paymentMode} (${cardName})</span>
                        </div>
                        ` : ''}
                        <div class="detail-row">
                            <span class="detail-label">Transaction Date</span>
                            <span class="detail-value">${dateString}</span>
                        </div>
                    </div>

                    <div class="receipt-actions">
                        <a href="/" class="btn btn-home"><i class="fa-solid fa-house"></i> Return Home</a>
                        <button onclick="window.print()" class="btn btn-print"><i class="fa-solid fa-print"></i> Print Receipt</button>
                        ${!isSuccess ? `
                        <a href="https://wa.me/918433206010" target="_blank" class="btn btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> Chat Support</a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        res.status(200).setHeader('Content-Type', 'text/html').send(responsePage);

    } catch (error) {
        console.error("Critical error in CCAvenue response processor:", error);
        res.status(500).send(renderSystemErrorPage(
            "Internal Server Error in Callback",
            "An error occurred while parsing and validating the transaction feedback from CCAvenue. Your transaction may have completed successfully, but we failed to render the receipt.",
            error.message
        ));
    }
};

/**
 * Generates a clean styled HTML error page for severe integration bugs
 */
function renderSystemErrorPage(errorTitle, errorDescription, technicalDetails = "") {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Integration Error | Revanta Growth Media Secure Payment</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            body {
                font-family: 'Inter', sans-serif;
                background-color: #f4f7f6;
                color: #1a1a1a;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
            }
            .error-card {
                background: white;
                padding: 40px;
                border-radius: 25px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.06);
                max-width: 500px;
                width: 100%;
                text-align: center;
            }
            .error-icon {
                font-size: 4rem;
                color: #e63946;
                margin-bottom: 20px;
            }
            h2 { font-family: 'Outfit', sans-serif; color: #0a255c; margin-bottom: 15px; font-size: 1.5rem; }
            p { color: #555; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px; }
            .tech-details {
                background: #f8f9fa;
                border: 1px solid #eee;
                padding: 15px;
                border-radius: 10px;
                font-family: monospace;
                font-size: 0.8rem;
                color: #666;
                text-align: left;
                word-break: break-all;
                max-height: 150px;
                overflow-y: auto;
                margin-bottom: 25px;
            }
            .btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: #0a255c;
                color: white;
                padding: 12px 25px;
                border-radius: 50px;
                font-weight: 700;
                text-decoration: none;
                font-size: 0.95rem;
                transition: 0.3s;
            }
            .btn:hover { background: #123780; transform: translateY(-2px); }
        </style>
    </head>
    <body>
        <div class="error-card">
            <div class="error-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <h2>${errorTitle}</h2>
            <p>${errorDescription}</p>
            ${technicalDetails ? `<div class="tech-details">${technicalDetails}</div>` : ''}
            <a href="/" class="btn"><i class="fa-solid fa-house"></i> Return Home</a>
        </div>
    </body>
    </html>
    `;
}
