import express from "express";

const router = express.Router();

import {
  signUpValidator,
  logInValidator
} from '../utils/Validations/authValidation.js';

import { signUp,logIn } from "../controller/authController.js";

router
  .route('/signUp')
  .post(signUpValidator, signUp);
router.post('/logIn', logInValidator, logIn);




export default router