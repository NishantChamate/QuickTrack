// app.js

const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle send-location event
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        io.emit("user-disconnect", socket.id);
    });
});

// Route for the home page
app.get("/", (req, res) => {
    res.render("index");
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
