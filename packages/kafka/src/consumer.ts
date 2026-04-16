import { Consumer, Kafka } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupidId: string) => {
  const consumer: Consumer = kafka.consumer({ groupId: groupidId });
  const connect = async () => {
    await consumer.connect();
    console.log("Kafka consumer connected: ", groupidId);
  };

  const subscribe = async (
    topic: string,
    handler: (message: any) => Promise<void>,
  ) => {
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString();
          if (value) {
            await handler(JSON.parse(value));
          }
        } catch (error) {
          console.log("error processing message", error);
        }
      },
    });
  };

  const disconnect = async () => {
    await consumer.disconnect();
  };

  return {
    connect,
    subscribe,
    disconnect,
  };
};
