import { Router } from "express";
import { gmailAgent, setGmailAccessToken } from "../agents/gmailAgent.ts";
import { ensureAuthenticated } from "../middlewares/middleware.ts";

const router = Router();

router.post("/", ensureAuthenticated, async (req, res) => {
  const { prompt } = req.body;
  const accessToken = (req.user as any)?.accessToken; 
  
  if (!req.user || !accessToken) {
    return res.status(401).json({ error: "Authentication failed. Please re-login." });
  }

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    // Set the access token for this request
    setGmailAccessToken(accessToken);
    
    // Let the agent handle the request naturally
    const response = await gmailAgent.generate([
      { role: "user", content: prompt }
    ]);
    
    res.json({ text: response.text });
    
  } catch (error) {
    console.error("Mastra Agent Error:", error);
    return res.status(500).json({ 
      error: "Agent execution failed.",
      details: error.message 
    });
  }
});

export default router;