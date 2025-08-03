// Example Netlify Function for handling Stripe webhooks
// This is a template - customize based on your needs

export async function handler(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    
    // Handle different Stripe webhook events
    switch (body.type) {
      case 'checkout.session.completed':
        // Handle successful payment
        console.log('Payment completed:', body.data.object);
        break;
        
      case 'customer.subscription.created':
        // Handle new subscription
        console.log('Subscription created:', body.data.object);
        break;
        
      case 'customer.subscription.updated':
        // Handle subscription updates
        console.log('Subscription updated:', body.data.object);
        break;
        
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        console.log('Subscription cancelled:', body.data.object);
        break;
        
      default:
        console.log('Unhandled event type:', body.type);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid payload' })
    };
  }
}
