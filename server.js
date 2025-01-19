const express = require("express");
// const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const multer = require('multer');
const { measureMemory } = require("vm");
const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage: storage });

const app = express();
const maxCookieAge = 24 * 60 * 60 * 1000;

 
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


mongoose.connect(
  "mongodb+srv://priyankraut2424:priyank%402422@devcluster.takds.mongodb.net/Social_Media",
  // { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("db connected"))
.catch((error) => console.error("db connection error:", error));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
  ph_no: { type: Number },
  birth_date: { type: Date },
  gender: { type: String },
  interest: { type: String },
  about: { type: String },
  profile_img : {data: Buffer, contentType: String },
});

const User = mongoose.model("User", userSchema);

const cardSchema = new mongoose.Schema({
  email: {type: String},
  image: {data: Buffer, contentType: String },
  title: {type: String},
  text: {type: String},
})

const Cards= mongoose.model("Cards",cardSchema);


app.get("/", async (req, res) => {
  const email = req.cookies.userEmail; 

  try {    
    const allCards = await Cards.find();

    if (!allCards || allCards.length === 0) {
      return res.status(404).json({ message: "No cards are found!!" });
    }

    // Convert image buffer to base64
    const cards= allCards.map(card => ({
      ...card._doc,
      image: `data:${card.image.contentType};base64,${card.image.data.toString('base64')}`
    }));

    if(!email){
      return res.status(200).json({ data: cards });
    }

    res.status(200).json({ data: cards, isLogin: true });

  } catch (error) {
    res.status(500).json({ message: "Error retrieving cards: " + error.message });
  }
});


app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  // console.log('Received Signup Request:', { email, password });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.cookie('userEmail', email, { httpOnly: true, maxAge: maxCookieAge, sameSite: 'Lax', secure: false });
    console.log("Cookie : ",req.cookies)

    res.status(200).json({ message: 'User created successfully', isLogin: true });
    // console.log('User created successfully');

  } catch (error) {
    // console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('/login', async (req, res) => {
  // console.log('Received Login Request:', req.body);

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // console.log('Invalid email');
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.cookie('userEmail', email, { httpOnly: true, maxAge: maxCookieAge, sameSite: 'Lax' , secure: false });
    console.log("Cookie : ", req.cookies)
    
    res.status(200).json({ message: 'Login successful', isLogin: true });
  } catch (error) {
    // console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('/details', async (req, res) => {
  const { name, age, ph_no, birth_date, gender, interest, about } = req.body;
  const email = req.cookies.userEmail; 
  // console.log(req.cookies)

  if (!email) {
    console.log("Please Login first");
    return res.status(400).json({ message: 'Please Login first' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email }, 
      { $set: { name, age, ph_no, birth_date, gender, interest, about } },
      { new: true }
    );

    if (!updatedUser) {
      // console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }
    // console.log("Successfully updated the profile");
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    // console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post("/upload", upload.single("image"), async (req, res) =>{
  const {title, text }= req.body;
  const email = req.cookies.userEmail; 
  // console.log(req.cookies)

  if (!email) {
    // console.log("Please Login first");
    return res.status(400).json({ message: 'Please Login first' });
  }
  try{
    const newCard = new Cards({
      email,
      image:{
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      title,
      text,
    }) 
    await newCard.save();
    // console.log("Uploaded successfully");
    res.status(201).send('Card created successfully!');
  }
  catch(error){
    console.log(error.message);
    res.status(400).send('Error creating post: ' + error.message);
  }
})


app.get("/upload", async (req, res) => {
  const email = req.cookies.userEmail;
  try {

    if(!email){
      return res.status(400).json({message:"Please login first !"})
    }
    
    const allCards = await Cards.find({email});

    if (!allCards || allCards.length === 0) {
      return res.status(404).json({ message: "No cards are found!!" });
    }

    // Convert image buffer to base64
    const cards= allCards.map(card => ({
      ...card._doc,
      image: `data:${card.image.contentType};base64,${card.image.data.toString('base64')}`
    }));

    res.status(200).json({ data: cards });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cards: " + error.message });
  }
});


app.put("/upload/:id", upload.single("image") , async (req,res) =>{
  const cardId= req.params.id;
  const { title, text } = req.body;

  try{
    const card = await Cards.findByIdAndUpdate(cardId, {
      title,
      text,
      ...(req.file && { 
        image: { 
          data: req.file.buffer, 
          contentType: req.file.mimetype 
        } 
      })
    },
    { new: true })

    if (!card){
      return res.status(404).json({ message: "Card not found !!"})
    }

    return res.status(200).json({message:"successfully updated the card", card:card})

  } catch(error){
    res.status(500).json("server error")
  }
})


app.delete("/upload/:id", async (req,res) =>{
  const cardId= req.params.id;
  try{
    const deleteCard = await Cards.findByIdAndDelete(cardId);

    if (!deleteCard){
      return res.status(404).json({message:"Card not found !!"})
    }

    return res.status(200).json({message:"Card is successfully deleted !!"})

  }catch(error){
    return res.status(500).json({message:"Server problem !"})
  }
})


app.post("/profile", upload.single("profile_img"), async ( req, res) => {
  const email = req.cookies.userEmail;

  if (!email) {
    console.log("Please Login first");
    return res.status(400).json({ message: 'Please Login first' });
  }

  try{
    const updatedUser = await User.findOneAndUpdate( {email},
      {profile_img:{
        data: req.file.buffer,
        contentType: req.file.mimetype,}
      }, 
      {new:false} )

  if (!updatedUser) {
    console.log("User not found");
    return res.status(404).json({ message: 'User not found' });
  }
  console.log("profile photo updated")
  res.status(200).json({ message: 'profile photo updated', user: updatedUser });

  } catch (error) {
    console.error('Error updating profile photo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})


app.get(["/profile", "/profile/:id"], async (req, res) => {
  const email = req.cookies.userEmail;  // Get the logged-in user's email from cookies
  const user_id = req.params.id;        // Optional parameter for another user's profile

  if (!email) {
    return res.status(400).json({ message: "Please login first!" });
  }

  let user;

  try {
    if (user_id) {
      // Fetching the user by the provided `id`
      user = await User.findOne({ _id: user_id });
    } else {
      // Fetching the user by `email`
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, age, ph_no, gender, dob, interest, about, profile_img } = user;

    // Construct the profile image if it exists
    let image = null;
    if (profile_img && profile_img.data) {
      image = `data:${profile_img.contentType};base64,${profile_img.data.toString('base64')}`;
    }

    const detail = {
      name,
      age,
      ph_no,
      gender,
      dob,
      interest,
      about,
      image,
    };

    res.status(200).json({ data: detail });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Error retrieving profile", error });
  }
});


app.post("/search", async (req, res) => {
  const { searchInput } = req.body; // Extract from req.body

  try {
      const users = await User.find(
          { name: { $regex: searchInput, $options: 'i' } }, // i for Ignore Case
          "_id name profile_img"
      );

      const cards = await Cards.find(
          { title: { $regex: searchInput, $options: 'i' } } // Fix typo in $options
      );


      const found_users = users.map(user => ({
        _id: user._id,
        name: user.name,
        image: user.profile_img && user.profile_img.data && user.profile_img.contentType ? 
            `data:${user.profile_img.contentType};base64,${user.profile_img.data.toString('base64')}` : null
      }));

      const found_cards = cards.map(card => ({
        ...card._doc,
        image: `data:${card.image.contentType};base64,${card.image.data.toString('base64')}`
      }));


      if ((!users || users.length === 0) && (!cards || cards.length === 0)) {
          return res.status(404).json({ message: "Both User & Cards are not found." });
      } else if (!users || users.length === 0) {
          return res.status(200).json({ message: "No user found.", data:{found_cards } });
      } else if (!cards || cards.length === 0) {
          return res.status(200).json({ message: "No card found.", data:{found_users} });
      }


      return res.status(200).json({ message: "Users found.", data: { found_users, found_cards } });
  } catch (error) {
      return res.status(500).json({ message: "Server error.", error });
  }
});



app.get("/search", async (req, res) =>{
  const {user_id} = req.query;

  try{
    const user_detail= await User.findOne({_id: user_id});

    if(!user_detail){
      return res.status(404).json({message:"User not Found !!"});
    };

    return res.status(200).json({message:"User found.", data: user_detail});
  }catch(error){
    return res.status(500).json({message:"server error."});
  }
});


app.get("/logout", async (req, res) =>{ 
  res.clearCookie("userEmail",{path:"/"});
  res.status(200).json({message:"Logged out successfully !!"});
})


// app.use(express.static(path.join(__dirname, 'build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
