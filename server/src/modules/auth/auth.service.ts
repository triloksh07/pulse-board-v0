import { HttpError } from "../../utils/httpError.js";
import { signToken } from "../../utils/jwt.js";
import { User } from "./user.model.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { RegisterInput, LoginInput } from "./auth.validation.js";

function serializeUser(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });

  if (existing) {
    throw new HttpError(409, "Email is already registered");
  }

  const password = await hashPassword(input.password);
  const user = await User.create({ ...input, password });

  return {
    user: serializeUser(user),
    token: signToken({ sub: user._id.toString(), email: user.email }),
  };
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const matches = await verifyPassword(input.password, user.password);

  if (!matches) {
    throw new HttpError(401, "Invalid email or password");
  }

  return {
    user: serializeUser(user),
    token: signToken({ sub: user._id.toString(), email: user.email }),
  };
}

export { serializeUser };
