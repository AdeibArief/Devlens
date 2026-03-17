import express from "express";
import Review from "../models/Review.js";
import auth from "../middleware/auth.js";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Stream AI review
router.post("/stream", auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ message: "Code is required" });


    const prompt = `You are an expert code reviewer. Review the following ${language} code and provide:
1. **Summary** - What the code does in one line
2. **Issues** - Bugs, errors, or bad practices (be specific)
3. **Improvements** - Concrete suggestions to make it better
4. **Security** - Any security concerns if applicable
5. **Overall Score** - Rate it out of 10

Code:
\`\`\`${language}
${code}
\`\`\`

Be concise, direct, and helpful. Format your response clearly with the headers above.`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    let fullFeedback = "";

    for await (const chunk of result) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        fullFeedback += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    // Save to DB after streaming
    const title = code.trim().split("\n")[0].slice(0, 50) || "Untitled Review";
    await Review.create({
      user: req.user.id,
      code,
      language,
      feedback: fullFeedback,
      title,
    });
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Get all reviews for user
router.get("/history", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-code -feedback");
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single review
router.get("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete review
router.delete("/:id", auth, async (req, res) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
