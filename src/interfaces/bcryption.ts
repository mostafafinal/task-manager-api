export interface HashPassword {
    hashPassword(password: string): Promise<string>;
}

export interface VerifyPassword {
    verifyPassword(
        orginalPassword: string,
        hashedPassword: string
    ): Promise<boolean>;
}
