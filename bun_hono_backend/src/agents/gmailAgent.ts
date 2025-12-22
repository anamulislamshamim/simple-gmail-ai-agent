import { Agent } from '@mastra/core/agent';
import { unreadEmailsTool } from "../tools/getUnreadEmailsTool";

export const gmailAgent = new Agent({
  name: "gmail-agent",
  instructions: `
    You are a professional Gmail assistant. 
    When the user asks for unread or new emails, use the listUnreadEmails tool.
    Present the results in a clean, human-readable summary. 
    Always mention the sender and the subject line.
  `,
  model: {
    provider: 'GOOGLE',
    id: 'google/gemini-2.5-flash', // google/gemini-2.5-flash-lite
    apiKey: process.env.GEMINI_API_KEY
  },
  tools: {
    listUnreadEmails: unreadEmailsTool,
  },
});