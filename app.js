require("dotenv").config();
const express = require("express");
const app = express();
const imageRoutes = require("./routes/imageRoutes");

app.use(express.json());
app.use("/api", imageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
