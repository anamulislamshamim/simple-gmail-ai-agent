import { google } from "googleapis";

export async function getUnreadEmails(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth });

    try {
        // 1. First, get the list of unread message IDs
        const listResponse = await gmail.users.messages.list({
            userId: "me",
            q: "is:unread",
            maxResults: 10,
        });

        const messages = listResponse.data.messages || [];
        
        if (messages.length === 0) {
            console.log("Debug: No unread emails found");
            return [];
        }

        console.log(`Debug: Found ${messages.length} unread emails`);
        
        // Fetch full details for each message
        const detailedMessages = await Promise.all(
            messages.map(async (message) => {
                try {
                    const detailResponse = await gmail.users.messages.get({
                        userId: "me",
                        id: message.id,
                        format: 'metadata', // 'metadata' gives headers without full body
                        metadataHeaders: ['From', 'To', 'Subject', 'Date']
                    });

                    const msg = detailResponse.data;
                    const headers = msg.payload?.headers || [];
                    
                    // Helper to extract header value
                    const getHeader = (name: string) => 
                        headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || 'Unknown';
                    
                    // Format date nicely
                    const formatDate = (dateStr: string) => {
                        try {
                            const date = new Date(parseInt(dateStr));
                            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        } catch {
                            return dateStr;
                        }
                    };

                    // Extract snippet (preview)
                    const snippet = msg.snippet || 'No preview available';
                    
                    // Check for attachments
                    const hasAttachments = msg.payload?.parts?.some(
                        (part: any) => part.filename && part.filename.length > 0
                    ) || false;

                    return {
                        id: msg.id,
                        threadId: msg.threadId,
                        from: getHeader('From'),
                        to: getHeader('To'),
                        subject: getHeader('Subject') || '(No Subject)',
                        date: formatDate(msg.internalDate),
                        snippet: snippet.length > 150 ? snippet.substring(0, 150) + '...' : snippet,
                        hasAttachments: hasAttachments,
                        isUnread: msg.labelIds?.includes('UNREAD') || true
                    };
                } catch (error) {
                    console.error(`Error fetching message ${message.id}:`, error.message);
                    // Return basic info if detailed fetch fails
                    return {
                        id: message.id,
                        threadId: message.threadId,
                        from: 'Error loading',
                        subject: 'Could not load email',
                        date: 'Unknown',
                        snippet: 'Error loading email content',
                        hasAttachments: false,
                        isUnread: true
                    };
                }
            })
        );

        console.log(`Debug: Successfully fetched ${detailedMessages.length} detailed emails`);
        return detailedMessages;

    } catch (error) {
        console.error("Error in getUnreadEmails:", error.message);
        throw error;
    }
};