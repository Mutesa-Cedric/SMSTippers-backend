import { hash, compare } from "bcrypt";
const secret = process.env.SECRET
export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
};


export const comparePassword = async (password: string, encryptedPassword: string): Promise<Boolean> => {
    return await compare(password, encryptedPassword);
}

