import jwt from 'jsonwebtoken';

interface TokenData {
    id: string;
    username: string;
    email: string;
    // Add other properties as needed
}

export function decodeToken(tokenSecret: string = process.env.TOKEN_SECRET): TokenData {
    const emptyTd:TokenData = {id:'', username:'', email:''}
    console.log(document.cookie)
    // Retrieve token from browser's cookies
    const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

    if (!token) {
        return emptyTd; // Token is not provided
    }

    try {
        const decoded = jwt.verify(token, tokenSecret) as TokenData;
        // You can perform additional checks here if needed
        return decoded; // Return decoded token data
    } catch (error) {
        console.error('Error decoding token:', error);
        return emptyTd; // Token decoding failed
    }
}