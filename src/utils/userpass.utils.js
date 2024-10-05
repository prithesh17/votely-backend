import crypto from 'crypto';

export const generateUniquePassword = () => {
    const randomString = crypto.randomBytes(4).toString('hex'); 
    const timestamp = Date.now(); 
    return `${randomString}-${timestamp}`; 
};