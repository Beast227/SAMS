import argon2 from 'argon2';

export const hashPassword = async (password: string) => {
    try {
        return await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16, // 64 mb of Ram
            timeCost: 3,    // number of iterations
            parallelism: 1 // threads to use
        })
    } catch (error) {
        throw new Error('Password hashing failed');
    }
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        return await argon2.verify(hash, password);
    } catch (error) {
        return false;
    }
};