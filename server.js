const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "data.json";

app.use(express.json());
app.use(cors({
    origin: "https://tejas739.github.io",  // ✅ Only allow GitHub Pages
    methods: ["GET", "POST"]
}));

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// ✅ Store Form Data Persistently
app.post("/submit-form", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Read existing data
        let formData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        formData.push({ name, email, message });

        // Save data back to file
        await fs.promises.writeFile(DATA_FILE, JSON.stringify(formData, null, 2));

        console.log("Received Data:", { name, email, message });
        res.json({ message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Error writing data:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Fetch Stored Data
app.get("/get-forms", (req, res) => {
    try {
        const formData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        res.json(formData);
    } catch (error) {
        console.error("Error reading data:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Start Server
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));
