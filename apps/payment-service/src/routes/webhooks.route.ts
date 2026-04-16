import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../../utils/stripe";
import { error } from "console";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const webhookRoute = new Hono();

webhookRoute.post("/stripe", async (c) => {
  // Handle Stripe webhook events here
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig as string, webhookSecret);
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return c.json({ error: "Webhook signature verification failed" }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );
      // TODO: CREATE ORDER
      console.log("Checkout session completed:", session);
      break;
    default:
        break;  
  }
  return c.json({received: true});
});

export default webhookRoute;