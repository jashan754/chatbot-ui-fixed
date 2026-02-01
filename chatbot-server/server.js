const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
   
    res.json({
        reply: `Server is running`,
      });
    
  });
app.post("/chat", (req, res) => {
  const { message } = req.body;

  setTimeout(() => {
    res.json({
      reply: `AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.
      AI Insight: Based on "${message}", revenue is trending upward and user retention has improved.`,
      
    });
  }, 2000); // simulate AI thinking
});

app.listen(4000, () => {
  console.log("Dummy AI server running on http://localhost:4000");
});