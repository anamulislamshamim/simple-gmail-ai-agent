import { useState } from "react";
import { sendChatMessage } from "../services/api";
import Markdown from 'react-markdown'

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, `You: ${input}`]);
    setLoading(true);

    try {
      const res = await sendChatMessage(input);

      setMessages((prev) => [
        ...prev,
        `Agent: ${res.text}`,
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        "Agent: ❌ Please login again",
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="border h-64 p-4 overflow-y-auto mb-4 bg-white rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2 text-sm">
            <Markdown>{msg}</Markdown>
          </div>
        ))}
        {loading && <div className="text-gray-400">Thinking...</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
