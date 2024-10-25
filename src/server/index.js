require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

const API_KEY = process.env.API_KEY;

const IMAGE_END_POINT = "https://api.nasa.gov/mars-photos/api/v1/rovers";

async function getRoverImages(rover) {
  const res = await axios.get(
    `${IMAGE_END_POINT}/${rover}/latest_photos?api_key=${API_KEY}`
  );
  return res.data;
}

// your API calls
app.get("/recent-image", async (req, res) => {
  const rover = req.query.rover;
  try {
    let data = await getRoverImages(rover);
    res.send(data);
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
