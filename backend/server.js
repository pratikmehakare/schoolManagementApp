const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser")
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

const authRoute = require("./routes/authRoutes")
const classRoute = require("./routes/classRoutes")
const teacherRoute = require("./routes/teacherRoutes")
const studentRoute = require("./routes/studentRoutes")
const analyticsRoute = require("./routes/analyticsRoutes")
const utilsRoute = require("./routes/utilsRoutes")
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/class",classRoute)
app.use("/api/v1/teacher",teacherRoute)
app.use("/api/v1/student",studentRoute)
app.use("/api/v1/analytics",analyticsRoute)
app.use("/api/v1/utils",utilsRoute)


const db = require("./config/dbConnection")
db();

app.listen(PORT, () => {
   console.log(`Server started at PORT ${PORT}`);
});
