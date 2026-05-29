import {Router,} from "express";
import {AuthService} from "./auth.service.js";
import { loginValidator, signupValidator } from "./auth.validation.js";
import {catchAsync}from "../../shared/utils/catchAsync.js"
import { sendResponse } from "@/shared/utils/ApiResponse.js";

const router=Router();

//controller to handle user signup and profile creation
const signup=catchAsync(async(req,res,next)=>{
    
    const result=await AuthService.signup(email,password,role);
    sendResponse(res,result);
})

export default router;