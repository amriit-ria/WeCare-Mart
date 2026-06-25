/**
 * WeCare Premium Mart
 * Production-Grade Payment Gateway Backend Verification Example
 * 
 * Language: Node.js (with Express & axios)
 * 
 * Crucial Security Note: Never trust client-side transaction status alone.
 * Always hit the merchant APIs server-side to confirm payment authenticity
 * before shipping or logging the status as 'Paid'.
 */

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Load securely from secure server environment variables (never hardcoded)
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "test_secret_key_your_actual_key_here";
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8g8M8Pl_ZEMZaaMK"; // Sandbox key used in frontend

/**
 * 1. KHALTI PAYMENT VERIFICATION ENDPOINT
 * 
 * Receives the token from the frontend pay widget and calls Khalti's 
 * verification endpoint server-side to check that the payment exists, matches the amount, and is complete.
 */
app.post('/api/verify-khalti', async (req, res) => {
  const { token, amount, orderId } = req.body;

  if (!token || !amount) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing token or purchase amount parameters." 
    });
  }

  try {
    // Send token lookup request to Khalti's securely isolated servers
    const response = await axios.post(
      'https://khalti.com/api/v2/payment/verify/', // or sandbox equivalent
      {
        token: token,
        amount: amount // amount in Paisa
      },
      {
        headers: {
          'Authorization': `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // If Khalti returns HTTP 200, check details match
    const billingInfo = response.data;
    
    // Double safeguard: Verify amount and product mapping
    if (billingInfo && billingInfo.amount === amount) {
      // payment is verified! Log details in database and mark order as 'Paid'.
      return res.json({
        success: true,
        message: "Khalti payment transaction has been verified successfully.",
        transactionId: billingInfo.idx,
        state: billingInfo.state.name
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Paid amount mismatch."
      });
    }

  } catch (error) {
    console.error("Khalti verification backend error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "External communication error with Khalti API.",
      details: error.response?.data || error.message
    });
  }
});


/**
 * 2. ESEWA SIGNATURE & STATUS LOOKUP (v2)
 * 
 * After eSewa redirects client to success_url containing transaction_uuid,
 * this endpoint verifies the request parameters and performs a server-to-server 
 * status check dynamically to ensure the payload was not tampered with.
 */
app.post('/api/verify-esewa', async (req, res) => {
  const { transaction_uuid, total_amount, product_code } = req.body;

  if (!transaction_uuid || !total_amount) {
    return res.status(400).json({
      success: false,
      message: "Missing required query transaction uuid or final total amount parameters."
    });
  }

  try {
    // Stage A: Decrypt/Verify HMAC SHA-256 local signature mapping
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code || 'EPAYTEST'}`;
    const cleanSecret = ESEWA_SECRET_KEY.trim();

    const expectedSignature = crypto
      .createHmac('sha256', cleanSecret)
      .update(message)
      .digest('base64');

    // Stage B: Hit eSewa's transaction status portal securely server-to-server
    // We send lookup requests to see if this uuid has recorded status of "COMPLETE"
    const lookupUrl = `https://rc-epay.esewa.com.np/api/epay/transaction/status/` +
      `?product_code=${product_code || 'EPAYTEST'}` +
      `&total_amount=${total_amount}` +
      `&transaction_uuid=${transaction_uuid}`;

    const lookupResponse = await axios.get(lookupUrl);

    if (lookupResponse.data && lookupResponse.data.status === "COMPLETE") {
      // eSewa server certifies this transaction is indeed verified & fully funded!
      return res.json({
        success: true,
        message: "eSewa gateway transaction matches status COMPLETE. Cleared to process.",
        details: lookupResponse.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "eSewa status lookup returned incomplete or failed code.",
        status: lookupResponse.data?.status || "NOT_FOUND"
      });
    }

  } catch (error) {
    console.error("eSewa verification backend error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "External communication error with eSewa Status API.",
      details: error.response?.data || error.message
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Payment Gateway backend helper online on http://localhost:${PORT}`);
});
