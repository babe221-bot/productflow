import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// Initialize Sentry only if DSN is provided
const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || "development",
    beforeSend(event) {
      // Don't send errors from localhost in development
      if (process.env.NODE_ENV === "development" && 
          (event.request?.url?.includes("localhost") || 
           event.request?.url?.includes("127.0.0.1"))) {
        return null;
      }
      return event;
    },
  });
}

export const captureException = (error: Error, context?: any) => {
  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error("Error captured (Sentry not configured):", error, context);
  }
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = "info") => {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`Message captured (Sentry not configured): [${level}] ${message}`);
  }
};

export const setUserContext = (user: any) => {
  if (SENTRY_DSN) {
    Sentry.setUser(user);
  }
};

export const clearUserContext = () => {
  if (SENTRY_DSN) {
    Sentry.setUser(null);
  }
};

export default Sentry;