import { createConsumer, createKafkaClient } from "@repo/kafka";
import sendMail from "./utils/mailer";

const kafka = createKafkaClient("email-service");
const consumer = createConsumer(kafka, "email-service-group");

const start = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe([
      {
        topicName: "user.created",
        topicHandler: async (message) => {
          const { email, username } = message.value;
          console.log( "Received message:", username, email);
          if (email) {
            await sendMail({
              email,
              subject: "Welcome to E-commerce App",
              text: `Welcome ${username}. You account has been created!`,
            });
          }
        },
      },
      {
        topicName: "order.created",
        topicHandler: async (message) => {
          const { email, amount, status } = message.value;
          console.log(status);
          if (email) {
            await sendMail({
              email,
              subject: "Order has been created",
              text: `Hello! Your order: Amount: ${amount/100}, Status: ${status}`,
            });
          }
        },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};
start();
