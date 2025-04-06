const express = require("express");
const fs = require("fs"); 
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = "data.json";

app.use(express.json());
app.use(cors({
    origin: "*", // Allows all origins (update with GitHub Pages URL for security)
    methods: ["GET", "POST"]
}));

// Ensure the JSON file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Submit Form Data (Store in JSON File)
app.post("/submit-form", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Read existing data
        let formData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        formData.push({ name, email, message });

        // Write data back asynchronously
        await fs.promises.writeFile(DATA_FILE, JSON.stringify(formData, null, 2));

        console.log("Received Data:", { name, email, message }); // Log data in terminal
        res.send("Form submitted successfully!");
    } catch (error) {
        console.error("Error writing data:", error);
        res.status(500).send("Server error");
    }
});

// Get Stored Data
app.get("/get-forms", (req, res) => {
    try {
        const formData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        res.json(formData);
    } catch (error) {
        console.error("Error reading data:", error);
        res.status(500).send("Server error");
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));

