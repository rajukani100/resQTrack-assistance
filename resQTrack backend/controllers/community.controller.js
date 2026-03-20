const Community = require("../models/community");
const User = require("../models/User");
const playwright = require("playwright");
exports.createpost = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, location, category } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Community({
      title,
      description,
      user: { _id: user._id, name: user.name }, // Save user details
      location,
      category,
    });

    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully", data: newPost });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

exports.nearbypost = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const posts = await Community.find();
    res.status(200).json({ message: "Nearby posts fetched", data: posts });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

exports.reply = async (req, res) => {
  try {
    const { message } = req.body;
    const { postId } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId);
    const post = await Community.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.responses.push({ user: user._id, name: user.name, message });
    await post.save();

    res.status(200).json({ message: "Reply added", data: post });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

exports.resolved = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Community.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = "Resolved";
    await post.save();

    res.status(200).json({ message: "Post marked as resolved", data: post });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

const fetchdata = async (location, query) => {
  const browser = await playwright.chromium.launch({
    headless: false,
    args: ["--window-position=2000,100"],
  });
  const context = await browser.newContext({
    extraHTTPHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://www.justdial.com/",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  const page = await context.newPage();

  //   const location = "rajkot";
  //   const query = "petrolpump";

  // Go to Justdial homepage
  await page.goto(`https://www.justdial.com/${location}/search?q=${query}`, {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector("#mainContent", { timeout: 10000 });

  const data = await page.evaluate(() => {
    const resultBox = document.querySelectorAll(
      ".resultbox_info > div:nth-child(2)"
    );

    const fullData = [];

    resultBox.forEach((element) => {
      const data = {};
      const name = element.querySelector(
        ".resultbox_title_anchor"
      )?.textContent;
      const address = element.querySelector(".locatcity")?.textContent;
      data["name"] = name;
      data["address"] = address;
      fullData.push(data);
    });

    return fullData;
  });
  console.log(data);
  await browser.close();
  return data;
};
exports.searches = async (req, res) => {
  try {
    const { location, query } = req.query;
    if (!location || !query) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const data = await fetchdata(location, query);
    res.status(200).json({ success: true, services: data });
  } catch (error) {
    console.error("Error in searches:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
