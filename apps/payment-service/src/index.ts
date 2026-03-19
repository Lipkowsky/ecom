import { serve } from "@hono/node-server";
import { timeStamp } from "console";
import { Hono } from "hono";
import { uptime } from "process";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

const app = new Hono();
app.use('*', clerkMiddleware())

app.get("/health", (c) => {
  return c.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  })
});

app.get('/test', (c) => {
  const { userId } = getAuth(c)

  if (!userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }

  return c.json({
    message: 'Payment Service Authenticated!',
  })
})


const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      (info) => {
        console.log("Product service is running on port: 8002");
      },
    );
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
};
start();
