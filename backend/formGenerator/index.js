const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const PORT = process.env.PORT || 3005;

const formsData = {};

app.use(cors());
app.use(bodyParser.json());

// Endpoint for generating form URL
app.post("/forms/generate", async (req, res) => {
  const { v4: uuidv4 } = await import("uuid");

  const uniqueIdentifier = uuidv4();

  const { formStructure, data } = req.body;

  formsData[uniqueIdentifier] = {
    responses: [],
    formStructure,
    data,
  };

  res.json({ uniqueIdentifier });
});

// Endpoint for submitting form and triggering Shuffle workflow
app.post("/forms/submit", async (req, res) => {
  const { formStructure, data } = req.body;

  // Handle form submission (save responses, etc.)
  // ...

  res.json({ success: true });

  // Trigger Shuffle workflow
  try {
    const { default: fetch } = await import("node-fetch");
    const shuffleApiUrl =
      "https://shuffler.io/api/v1/hooks/webhook_5e6467a6-113b-49df-90d7-4e701fb0d328";

    const shuffleApiResponse = await fetch(shuffleApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        form_data: formStructure,
        user_input: data,
      }),
    });

    const shuffleApiData = await shuffleApiResponse.json();
    console.log("Shuffle API response:", shuffleApiData);
  } catch (error) {
    console.error("Error triggering Shuffle workflow:", error);
  }
});

// Endpoint for retrieving form data
app.get("/forms/:uniqueIdentifier", (req, res) => {
  const uniqueIdentifier = req.params.uniqueIdentifier;
  const formData = formsData[uniqueIdentifier];

  if (formData) {
    console.log("Form Data Sent:", formData);
    res.json({
      uniqueIdentifier,
      responses: formData.responses,
      formStructure: formData.formStructure,
      data: formData.data,
    });
  } else {
    console.error("Form not found. Unique Identifier:", uniqueIdentifier);
    res.status(404).json({ error: "Form not found." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
