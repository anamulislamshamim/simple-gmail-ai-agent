import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { google } from "googleapis";


const inputSchema = z.object({
  maxResults: z.number().optional().default(10),
});

export const unreadEmailsTool = createTool({
  id: "listUnreadEmails",
  description: "List unread emails from Gmail.",
  inputSchema,

  async execute({ context, runtimeContext }) {
    const maxResults = context?.maxResults ?? 10;
    const accessToken = runtimeContext?.get("accessToken") as string;

    if (!accessToken) {
      throw new Error("No Google access token found in runtime context");
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth });

    const listResponse = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults: maxResults,
    });

    const messages = listResponse.data.messages ?? [];

    if (messages.length === 0) {
      return {
        count: 0,
        emails: [],
        message: "No unread emails found.",
      };
    }

    const detailedMessages = await Promise.all(
      messages.map(async (message) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = detail.data.payload?.headers ?? [];

        const getHeader = (name: string) =>
          headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
            ?.value ?? "Unknown";

        return {
          id: detail.data.id,
          from: getHeader("From"),
          subject: getHeader("Subject"),
          snippet: detail.data.snippet,
          date: detail.data.internalDate
            ? new Date(Number(detail.data.internalDate)).toLocaleString()
            : "Unknown",
        };
      })
    );

    return {
      count: detailedMessages.length,
      emails: detailedMessages,
    };
  },
});
