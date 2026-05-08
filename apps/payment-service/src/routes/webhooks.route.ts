import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../../utils/stripe";
import { error } from "console";
import { producer } from "../../utils/kafka";

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
      
      producer.send("payment.successful", {
        value: {
          userId: session.client_reference_id,
          email: session.customer_details?.email,
          amount: session.amount_total,
          status: session.payment_status === "paid" ? "success" : "failed",
          products: lineItems.data.map((item) => ({
            name: item.description,
            quantity: item.quantity,
            price: item.price?.unit_amount,
          })),
        },
      });
      console.log("Payment successful event sent to Kafka:", session);

    default:
      break;
  }
  return c.json({ received: true });
});

export default webhookRoute;
