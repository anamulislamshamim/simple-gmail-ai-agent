export class GmailQueryParser {
  
  // Common email patterns
  static parse(userInput: string): string {
    let queryParts: string[] = [];
    
    // Convert to lowercase for easier matching
    const input = userInput.toLowerCase().trim();
    
    // 1. Date queries
    if (input.includes('today')) {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
      queryParts.push(`after:${today}`);
    }
    
    if (input.includes('yesterday')) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0].replace(/-/g, '/');
      queryParts.push(`after:${dateStr} before:${new Date().toISOString().split('T')[0].replace(/-/g, '/')}`);
    }
    
    if (input.includes('last week') || input.includes('past week')) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const dateStr = weekAgo.toISOString().split('T')[0].replace(/-/g, '/');
      queryParts.push(`after:${dateStr}`);
    }
    
    // 2. Status queries
    if (input.includes('unread')) queryParts.push('is:unread');
    if (input.includes('read')) queryParts.push('is:read');
    if (input.includes('starred') || input.includes('important')) queryParts.push('is:starred');
    
    // 3. Attachment queries
    if (input.includes('attachment') || input.includes('attached')) queryParts.push('has:attachment');
    
    // 4. From/to queries (simple pattern matching)
    const fromMatch = input.match(/from\s+(\w+)/i);
    if (fromMatch) {
      queryParts.push(`from:${fromMatch[1]}`);
    }
    
    const toMatch = input.match(/to\s+(\w+)/i);
    if (toMatch) {
      queryParts.push(`to:${toMatch[1]}`);
    }
    
    // 5. Subject queries
    const subjectMatch = input.match(/about\s+(.+)/i) || input.match(/subject.*?\s+(.+)/i);
    if (subjectMatch && !subjectMatch[1].includes('email') && !subjectMatch[1].includes('message')) {
      queryParts.push(`subject:"${subjectMatch[1].trim()}"`);
    }
    
    // 6. If no specific queries found, use as keyword search
    if (queryParts.length === 0) {
      // Remove common words and use as keyword
      const keywords = input
        .replace(/\b(email|emails|message|messages|find|search|show|get)\b/gi, '')
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 2);
      
      if (keywords.length > 0) {
        queryParts.push(keywords.join(' '));
      }
    }
    
    console.log("Debug: Final Query: " + queryParts.join(' '));
    return queryParts.join(' ');
  }
  
  // Helper to build manual queries
  static buildQuery(options: {
    from?: string;
    to?: string;
    subject?: string;
    after?: string; // YYYY/MM/DD
    before?: string; // YYYY/MM/DD
    hasWords?: string;
    is?: 'read' | 'unread' | 'starred';
    has?: 'attachment';
  }): string {
    const parts: string[] = [];
    
    if (options.from) parts.push(`from:${options.from}`);
    if (options.to) parts.push(`to:${options.to}`);
    if (options.subject) parts.push(`subject:"${options.subject}"`);
    if (options.after) parts.push(`after:${options.after}`);
    if (options.before) parts.push(`before:${options.before}`);
    if (options.hasWords) parts.push(options.hasWords);
    if (options.is) parts.push(`is:${options.is}`);
    if (options.has) parts.push(`has:${options.has}`);
    
    return parts.join(' ');
  }
}