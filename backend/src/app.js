const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');


// Load environment variables
dotenv.config();

console.log("✅ Loaded MONGODB_URI:", process.env.MONGODB_URI);

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['https://gym-hut-2026.vercel.app/'],
    credentials: true
}));
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/GYMHUT";


if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined. Check your .env file.");
    process.exit(1);
}

// ✅ Middleware: Allow JSON & Enable CORS
app.use(cors({
    origin: ["https://gym-hut-2026.vercel.app/", "http://localhost:8000"],
    credentials: true,  // Allow cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
}));
app.use(express.json()); // Enable JSON request parsing

let db; // Global variable to store DB connection


async function connectDB() {
    try {
        const client = new MongoClient(MONGODB_URI); // Removed deprecated options
        await client.connect();
        db = client.db(); // Store MongoDB instance
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err);
        process.exit(1);
    }
}

// ✅ API Route Example
app.get("/", (req, res) => {
    res.send("🚀 Server is running!");
});

// Function to generate a unique gym code
function generateCodeFromName(name) {
  const base = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const prefix = base.substring(0, 2).padEnd(2, 'X');
  return (prefix + random).substring(0, 6);
}

async function generateUniqueGymCode(gymname) {
  const gymsCollection = db.collection("GYMS");

  let code;
  let exists = true;

  while (exists) {
    code = generateCodeFromName(gymname);
    const found = await gymsCollection.findOne({ gymcode: code });
    if (!found) exists = false;
  }

  return code;
}

//  Registration Route
app.post("/register", async (req, res) => {
    try {
        console.log("Incoming Request:", req.body);  // ✅ Step 1: Log request
        const {name, email, phone, username, password, gymname, gymAddress} = req.body;

        if (!name || !email || !password || !phone || !username || !gymname || !gymAddress) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const gymsCollection = db.collection("GYMS");
        
        const existinggymname = await gymsCollection.findOne({ gymname });
        const existinggymadd = await gymsCollection.findOne({ gymAddress });
        const existingemail = await gymsCollection.findOne({ email });
        const existinguser = await gymsCollection.findOne({ username });

        if (existinggymname && existinggymadd) {
            return res.status(409).json({ error: "GYM already registered" });
        }
        if (existingemail && existinguser) {
            return res.status(409).json({ error: "Email and Username already registered" });
        }
        if (existinguser) {
            return res.status(409).json({ error: "username already registered" });
        }
        if (existingemail) {
            return res.status(409).json({ error: "Email already registered" });
        }
        // Generate a unique gym code
        const gymcode = await generateUniqueGymCode(gymname);

        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

        await gymsCollection.insertOne({
          gymname,
          gymAddress,
          owner: name,
          email,
          username,
          phone,
          gymcode,
          password: hashedPassword,
          status: "pending", // ⬅️ Gym needs admin approval
        });
        res.status(201).json({ message: "Gym registration started"});
    } catch (err) {
        console.error("❌ Error during registration:", err.message, err.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all gyms for admin dashboard
app.get("/api/gyms", async (req, res) => {
  try {
    const gyms = await db.collection("GYMS").find().toArray();
    res.json(gyms);
  } catch (err) {
    console.error("❌ Error fetching gyms:", err);
    res.status(500).json({ error: "Failed to load gyms" });
  }
});

// Approve a gym
app.patch("/api/gyms/approve/:gymcode", async (req, res) => {
  try {
    const { gymcode } = req.params;
    const gym = await db.collection("GYMS").findOne({gymcode});
    const result = await db.collection("GYMS").updateOne(
      { gymcode },
      { $set: { status: "approved" } }
    );
    await db.createCollection(`${gymcode}_members`);
    await db.createCollection(`${gymcode}_trainers`);
    const mailOptions = {
            from: process.env.EMAIL_USER,
            to: gym.email,
            subject: 'GYM registration confirmation',
            text: `Welcome to GYMHUT!\n\n` + `Your GYM code is: ${gymcode}\n\n`,
        };

        // Nodemailer transporter (using Gmail with app password)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // e.g., gymhut2000@gmail.com
                pass: process.env.EMAIL_PASS  // app password (NOT regular password)
            }
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
        });
    res.json({ message: "Gym approved successfully" });

  } catch (err) {
    res.status(500).json({ error: "Approval failed" });
  }
});

// Reject a gym
app.delete("/api/gyms/reject/:gymcode", async (req, res) => {
  try {
    const {gymcode} = req.params;
    await db.collection("GYMS").deleteOne({gymcode});
    res.json({ message: "Gym rejected and deleted" });
  } catch (err) {
    res.status(500).json({ error: "Rejection failed" });
  }
});

// Admin Login Route
app.post("/api/auth/admin", async (req, res) => {
    const { username, password} = req.body;
    try {
      if(username !== "Admin"){
        return res.status(401).json({ error: "Invalid username" });
      }
      else if(password !== "Admin@123"){
        return res.status(401).json({ error: "Invalid password" });
      }
      const user = {
        id: "admin123",
        name: "Admin",
        username: "Admin"
      };

      res.status(200).json({
        message: "Login successful",
        admin: user  // Note: make sure the key is 'admin'
      });

    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
//Login Route
app.post("/api/auth/login", async (req, res) => {
    const { username, password, gymcode, userType} = req.body;
    let user,temp;
    if (!username || !password || !userType || !gymcode) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const memCollection = db.collection(`${gymcode}_members`); 
        const ownerCollection = db.collection("GYMS");
        const traiCollection = db.collection(`${gymcode}_trainers`);
        
        if (userType === "member") {
            user = await memCollection.findOne({ username });
            temp = await ownerCollection.findOne({gymcode });
            if(temp.status !== "approved") {
              return res.status(403).json({ error: "Gym not approved yet" });
            }
        }else if (userType === "trainer") {
            user = await traiCollection.findOne({ username });
            temp = await ownerCollection.findOne({ gymcode });
            if(temp.status !== "approved") {
              return res.status(403).json({ error: "Gym not approved yet" });
            }
        }else if (userType === "owner") {
            user = await ownerCollection.findOne({ username, gymcode });
            if(user.status !== "approved") {
              return res.status(403).json({ error: "Gym not approved yet" });
            }
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password or GYMCODE" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                gymcode: user.gymcode || gymcode,
                userType
            }
        });


    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Forgot password route
app.post('/api/auth/forgot-password', async (req, res) => {
    const { username, gymcode,userType} = req.body;
    let user,temp;
    if (!username || !userType || !gymcode) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const memCollection = db.collection(`${gymcode}_members`); 
        const ownerCollection = db.collection("GYMS");
        const traiCollection = db.collection(`${gymcode}_trainers`);
        if (userType === "member") {
            user = await memCollection.findOne({ username });
            temp = await ownerCollection.findOne({gymcode });
            if(temp.status !== "approved") {
              return res.status(403).json({ error: "Gym not approved yet" });
            }
        }if (userType === "trainer") {
            user = await traiCollection.findOne({ username });
            temp = await ownerCollection.findOne({gymcode });
            if(temp.status !== "approved") {
              return res.status(403).json({ error: "Gym not approved yet" });
            }
        }else{
            user = await ownerCollection.findOne({ username, gymcode });
            if(user.status !== "approved") {
              return res.status(403).json({ error: "Gym not approved yet" });
            }
        }
        if (!user) return res.status(400).json({ error: 'Username not found' });

        const passcode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        await db.collection(gymcode).updateOne(
            { username },
            { $set: { resetPasscode: passcode, otpExpiry: expiry } }
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${passcode}`
        };

        // Nodemailer transporter (using Gmail with app password)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // e.g., gymhut2000@gmail.com
                pass: process.env.EMAIL_PASS  // app password (NOT regular password)
            }
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            res.json({ message: 'Passcode sent to your email' });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Reset password route
app.post('/api/auth/reset-password', async (req, res) => {
    const { username, userType, gymcode, passcode, newPassword } = req.body;
    let user,temp;
    if (!username || !userType || !gymcode || !passcode || !newPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const memCollection = db.collection(`${gymcode}_members`); 
        const ownerCollection = db.collection("GYMS");
        const traiCollection = db.collection(`${gymcode}_trainers`);
        if (userType === "member") {
            user = await memCollection.findOne({ username, resetPasscode: passcode });
            temp = await ownerCollection.findOne({gymcode });
            if(temp.status !== "approved") {
              return res.status(403).json({ error: "Gym not approved yet" });
            }
        }if (userType === "trainer") {
            user = await traiCollection.findOne({ username, resetPasscode: passcode });
            temp = await ownerCollection.findOne({gymcode });
            if(temp.status !== "approved") {
              return res.status(403).json({ error: "Gym not approved yet" });
            }
        }else{
            user = await ownerCollection.findOne({ username, resetPasscode: passcode, gymcode });
            if(user.status !== "approved") {
              return res.status(403).json({ error: "Gym not approved yet" });
            }
        }

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or passcode' });
        }

        // Optional: If you store otpExpiry timestamp, check for expiration here
        if (user.otpExpiry && new Date(user.otpExpiry) < new Date()) {
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (userType === "member") {
            await db.collection(`${gymcode}_members`).updateOne(
                { username },
                {
                    $set: { password: hashedPassword },
                    $unset: { resetPasscode: "", otpExpiry: "" },
                }
            );
        }if (userType === "trainer") {
            await db.collection(`${gymcode}_trainers`).updateOne(
                { username },
                {
                    $set: { password: hashedPassword },
                    $unset: { resetPasscode: "", otpExpiry: "" },
                }
            );
        }else{
            await db.collection("GYMS").updateOne(
                { username },
                {
                    $set: { password: hashedPassword },
                    $unset: { resetPasscode: "", otpExpiry: "" },
                }
            );
        }

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//GYM Data
app.get("/api/gym/:gymcode", async (req, res) => {
  const { gymcode } = req.params;
  try {
    const gymCollection = db.collection("GYMS");
    const gym = await gymCollection.findOne({ gymcode });

    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }

    const memberCollection = db.collection(`${gymcode}_members`);
    const members = await memberCollection.find().toArray();

    const trainerCollection = db.collection(`${gymcode}_trainers`);
    const trainers = await trainerCollection.find().toArray();

    // Add sample mock data for payments/equipment if not yet stored
    const gymData = {
      name: gym.gymname,
      code: gym.gymcode,
      location: gym.gymAddress,
      status: "Active",
      openHours: "6 AM - 9 PM",
      members,
      trainers,
      payments: [
        { month: "July", amount: "₹25,000" },
        { month: "June", amount: "₹22,000" }
      ],
      equipmentList: [
        { name: "Treadmill", quantity: 5 },
        { name: "Dumbbell", quantity: 15 }
      ]
    };

    res.json(gymData);
  } catch (err) {
    console.error("❌ Error fetching gym data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Member Profile by gymcode and username
app.get("/api/member/:gymcode/:username", async (req, res) => {
  const { gymcode, username } = req.params;

  try {
    const member = await db.collection(`${gymcode}_members`).findOne({ username });
    const gym = await db.collection("GYMS").findOne({ gymcode });
    const trainer = await db.collection(`${gymcode}_trainers`).findOne({ username: member.trainerid });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // You can exclude password before sending
    const { password, ...safeMember } = member;
    const {  ...safeGym } = gym;
    const {  ...safeTrainer } = trainer;

    res.json({
      member: safeMember,
      trainer: safeTrainer,
      gym: safeGym
    });
  } catch (err) {
    console.error("❌ Error fetching member profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//Add Member data
app.post("/api/members/add", async (req, res) => {
  try {
    const { name, email, phone, username, password, age, gender, membership, trainer, gymcode } = req.body;

    const collection = db.collection(`${gymcode}_members`);
    const existing = await collection.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "Username already exists in this gym" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await collection.insertOne({
      name,
      email,
      phone,
      username,
      password: hashedPassword,
      age,
      gender,
      trainerid: trainer, // Store trainer username
      plan: membership,
      status: "Pending",
      joined: new Date().toISOString(),
    });

    const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'GYM Registration Confirmation',
            text: `Your username : ${username}\n\n` +
                  `Please use this password ${password} to log in to your account\n\n`+
                  `Your GYMCODE is: ${gymcode}`+
                  `\n\nYour trainer is: ${trainer}`
        };

        // Nodemailer transporter (using Gmail with app password)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // e.g., gymhut2000@gmail.com
                pass: process.env.EMAIL_PASS  // app password (NOT regular password)
            }
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            res.json({ message: `Login credentials sent to member's email` });
        });

    res.status(201).json({ message: "Member added", memberId: result.insertedId });
  } catch (err) {
    console.error("❌ Add member error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Member
app.delete("/api/members/delete/:gymcode/:username", async (req, res) => {
  const { gymcode, username } = req.params;

  try {
    const collection = db.collection(`${gymcode}_members`);
    const result = await collection.deleteOne({ username });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error("❌ Delete member error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Trainer Profile by gymcode and username
app.get("/api/trainer/:gymcode/:username", async (req, res) => {
  const { gymcode, username } = req.params;

  try {
    const trainer = await db.collection(`${gymcode}_trainers`).findOne({ username });

    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    const assignedMembers = await db.collection(`${gymcode}_members`).find({ trainerid: username }).toArray();
    
    const schedule = trainer.schedule;
    // You can exclude password before sending
    const { password, ...safeTrainer } = trainer;

    res.json({
      ...safeTrainer,
      assignedMembers,
      schedule
    });
  } catch (err) {
    console.error("❌ Error fetching trainer profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//Add Trainer data
app.post("/api/trainers/add", async (req, res) => {
  try {
    const { name, email, phone, username, password, speciality, gymcode } = req.body;

    if (!name || !email || !phone || !username || !password || !speciality || !gymcode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const collection = db.collection(`${gymcode}_trainers`);
    const existing = await collection.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "Username already exists in this gym" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await collection.insertOne({
      name,
      email,
      phone,
      username,
      password: hashedPassword,
      speciality: speciality,
      plan: "Normal",
      status: "Pending",
      joined: new Date().toISOString(),
    });

    const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'GYM Registration Confirmation',
            text: `Your username : ${username}\n\n` +
                  `Please use this password ${password} to log in to your account\n\n`+
                  `Your GYMCODE is: ${gymcode}`
        };

        // Nodemailer transporter (using Gmail with app password)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // e.g., gymhut2000@gmail.com
                pass: process.env.EMAIL_PASS  // app password (NOT regular password)
            }
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            res.json({ message: `Login credentials sent to trainer's email` });
        });

    res.status(201).json({ message: "Trainer added", memberId: result.insertedId });
  } catch (err) {
    console.error("❌ Add trainer error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Trainer
app.delete("/api/trainers/delete/:gymcode/:username", async (req, res) => {
  const { gymcode, username } = req.params;

  try {
    const collection = db.collection(`${gymcode}_trainers`);
    const mcollection = db.collection(`${gymcode}_members`);
    const result = await collection.deleteOne({ username });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    await mCollection.updateMany(
      { trainerid: username },
      { $unset: { trainerid: "" } }
    );
    res.json({ message: "Trainer deleted successfully" });
  } catch (err) {
    console.error("❌ Delete trainer error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get assigned members for a trainer
app.get("/api/trainers/:gymcode/:trainerUsername/members", async (req, res) => {
  const { gymcode, trainerUsername } = req.params;

  try {
    const collection = db.collection(`${gymcode}_members`);
    const assignedMembers = await collection
      .find({ trainerid: trainerUsername })
      .project({ name: 1, username: 1, _id: 0 })
      .toArray();

    res.json(assignedMembers);
  } catch (err) {
    console.error("Error fetching assigned members:", err);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});



// ✅ Start Server After Connecting to DB
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}).catch(err => console.error("❌ Failed to start server:", err));
