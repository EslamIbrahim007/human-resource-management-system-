import User from "../../models/User.js";
import { UserRole } from "../../shared/constants/roles.js";
import { ApiError, ConflictError, NotFoundError, UnauthorizedError } from "@/shared/utils/apiError.js";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";
//service to handle user signup and profile creation
export const signup = async (email: string, password: string, role: UserRole) => {
    //1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ConflictError("User already exists");
    }
    //2. Create new user
    const user = new User({
        email,
        password,
        role
    });
    //3. generate jwt
    const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        env.jwtSecret as Secret,
        { expiresIn: env.jwtExpiresIn } as any
    );
    //4. save user to database
    await user.save();
    //5. return user and token
    return { user, token };
};
// service to handle user login
export const login = async (email: string, password: string) => {
    //1. checking if user is present
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found");
    }
    //2. checking if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid password");
    }
    //3.generate json web token
    const token = jwt.sign(
        { id: user._id, role: user.role ,email: user.email},
        env.jwtSecret as Secret,
        { expiresIn: env.jwtExpiresIn } as any
    );
    //4. return user and token
    return { user, token };
};
