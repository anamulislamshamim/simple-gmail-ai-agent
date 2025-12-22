// gmailAgent.ts
import { Agent } from "@mastra/core/agent";
import { getUnreadEmails } from "../gmail/gmailClient";

export const gmailAgent = new Agent({
  name: "gmail-agent",
  instructions: `
You are an AI assistant that can access the user's Gmail.

TOOLS AVAILABLE:
- listUnreadEmails: Use when user asks about unread or new emails.

OUTPUT:
Return structured data for frontend rendering.
`,
  model: {
    id: "google/gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY!,
  },
  tools: {
    listUnreadEmails: {
      description: "List unread emails from Gmail",
      execute: async ({ context }) => {
        // ✅ THIS IS THE FIX
        const accessToken = context.get("accessToken") as string | undefined;

        if (!accessToken) {
          throw new Error("Access token missing in runtime context");
        }

        const emails = await getUnreadEmails(accessToken);

        if (!emails || emails.length === 0) {
          return { message: "No unread emails found." };
        }

        return {
          count: emails.length,
          summary: `Found ${emails.length} unread email${emails.length > 1 ? "s" : ""}`,
          emails: emails.slice(0, 10).map((email: any, index: number) => ({
            number: index + 1,
            id: email.id,
            threadId: email.threadId,
            snippet: email.snippet?.slice(0, 100) ?? "No preview",
          })),
        };
      },
    },
  },
});




// import { Agent } from '@mastra/core/agent';
// import { 
//   getUnreadEmails, 
// } from "../gmail/gmailClient.ts";
// import { GmailQueryParser } from "../utils/queryParser.ts";

// let currentAccessToken: string | null = null;

// export const gmailAgent = new Agent({
//   name: "gmail-agent",
//   instructions: `
// You are an AI assistant that can access the user's Gmail.

// TOOLS AVAILABLE:
// listUnreadEmails: Use when user asks about "unread emails", "new emails", or "what's in my inbox".

// WHICH TOOL TO USE:
// - "Show unread emails" → listUnreadEmails()
// OUTPUT INSTRUCTIONS:
// 1. Formatted each email so that frontend client can easily show the result.

// `,
//   model: {
//     id: 'google/gemini-2.5-flash-lite',
//     apiKey: process.env.GEMINI_API_KEY
//   },
//   tools: {
//     listUnreadEmails: {
//       description: "List unread emails from Gmail. No parameters needed.",
//       execute: async () => {
//         if (!currentAccessToken) throw new Error("Access token not available");
//         const emails = await getUnreadEmails(currentAccessToken);
        
//         if (!emails || emails.length === 0) {
//           return { message: "No unread emails found." };
//         }
        
//         // Return with IDs so user can ask to read specific ones
//         return {
//           count: emails.length,
//           summary: `Found ${emails.length} unread email${emails.length > 1 ? 's' : ''}`,
//           emails: emails.slice(0, 10).map((email: any, index: number) => ({
//             number: index + 1,
//             id: email.id,
//             threadId: email.threadId,
//             snippet: email.snippet?.substring(0, 100) || 'No preview'
//           }))
//         };
//       },
//     },
//   },
// });

// // Token setter
// export function setGmailAccessToken(token: string) {
//   currentAccessToken = token;
// }