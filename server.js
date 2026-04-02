import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

const API_KEY = "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";

app.post("/generate", async (req, res) => {
  try {
    const { model, inputs, parameters } = req.body;

    if (!model || !inputs) {
      return res.status(400).json({ error: "Missing model or inputs" });
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs,
          parameters: parameters || {},
          options: { wait_for_model: true },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.log(err);
      return res.status(500).json({ error: err });
    }

    const buffer = await response.arrayBuffer();

    res.set("Content-Type", "image/png");
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});