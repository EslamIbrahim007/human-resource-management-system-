import express from 'express';
import 'dotenv/config'; // dotenv / config: Loads environment variables from a .env file.
import morgan from 'morgan'; // HTTP request logger middleware.
import dbConnation from './config/dbConnation.js';
import globalError from './Middleware/errorMiddleware.js';
import ApiError from './utils/apiError.js';


const app = express();
const port = process.env.PORT || 8000;

// Database connection
dbConnation();

// Middleware to parse JSON bodies
app.use(express.json());

// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
};

//global middleware for handling error (express )


// Routes
import employeeRoute from './routes/empolyeeRoute.js';
import departmentRoute from "./routes/departmentRoute.js";
import authRoute from './routes/authRoute.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoute.js';
import payrollRoutes from './routes/payrollRoute.js';

// Routes
app.use('/api/v1', employeeRoute);
app.use('/api/v1', departmentRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/record', attendanceRoutes);
app.use('/api/v1', leaveRoutes);
app.use('/api/v1/payroll', payrollRoutes);


// Static folder for payslips
app.use("/payslips", express.static("public/payslips"));

app.all('*', (req, res, next) => {
  //create error and pass it to error handler
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`,400));
})
//Global  error handler middleware
app.use(globalError);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
