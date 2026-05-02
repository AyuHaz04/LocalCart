export function orderConfirmationEmail({ buyerName, productName, quantity, totalAmount, deliveryAddress, orderId }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0;">
        <div style="max-width: 560px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background: #3b82f6; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🧵 LocalCraft</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0;">Order Confirmed!</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <p style="color: #374151; font-size: 16px;">Hi <strong>${buyerName}</strong>,</p>
            <p style="color: #6b7280;">Your order has been placed successfully. Here are your order details:</p>

            <!-- Order Details -->
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Product</td>
                  <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${productName}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Quantity</td>
                  <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${quantity}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Total Paid</td>
                  <td style="color: #3b82f6; font-size: 16px; font-weight: 700; text-align: right;">₹${totalAmount}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Order ID</td>
                  <td style="color: #111827; font-size: 12px; text-align: right;">${orderId}</td>
                </tr>
              </table>
            </div>

            <!-- Delivery Address -->
            <div style="margin-bottom: 24px;">
              <p style="color: #374151; font-weight: 600; margin-bottom: 6px;">📍 Delivery Address</p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                ${deliveryAddress.street}, ${deliveryAddress.city}<br/>
                ${deliveryAddress.state} - ${deliveryAddress.pincode}
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              The seller has been notified and will prepare your order shortly.
              You can track your order status in your dashboard.
            </p>

            <!-- CTA -->
            <div style="text-align: center; margin-top: 32px;">
              
                href="${process.env.NEXTAUTH_URL}/buyer"
                style="background: #3b82f6; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;"
              >
                View My Orders →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} LocalCraft. Support local artisans.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
}

export function newOrderSellerEmail({ sellerName, buyerName, productName, quantity, totalAmount, deliveryAddress }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0;">
        <div style="max-width: 560px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <div style="background: #10b981; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🧵 LocalCraft</h1>
            <p style="color: #a7f3d0; margin: 8px 0 0;">You got a new order! 🎉</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <p style="color: #374151; font-size: 16px;">Hi <strong>${sellerName}</strong>,</p>
            <p style="color: #6b7280;">Great news! <strong>${buyerName}</strong> just placed an order for your product.</p>

            <!-- Order Details -->
            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Product</td>
                  <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${productName}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Quantity</td>
                  <td style="color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${quantity}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Amount Earned</td>
                  <td style="color: #10b981; font-size: 16px; font-weight: 700; text-align: right;">₹${totalAmount}</td>
                </tr>
              </table>
            </div>

            <!-- Delivery Address -->
            <div style="margin-bottom: 24px;">
              <p style="color: #374151; font-weight: 600; margin-bottom: 6px;">📍 Deliver To</p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                ${deliveryAddress.street}, ${deliveryAddress.city}<br/>
                ${deliveryAddress.state} - ${deliveryAddress.pincode}
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              Please prepare the order and update its status from your seller dashboard.
            </p>

            <!-- CTA -->
            <div style="text-align: center; margin-top: 32px;">
              
                href="${process.env.NEXTAUTH_URL}/seller"
                style="background: #10b981; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;"
              >
                Go to Dashboard →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} LocalCraft. Support local artisans.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
}