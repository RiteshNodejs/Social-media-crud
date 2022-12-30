import jwt from "jsonwebtoken";

class AuthValidation{
    Validattion(parent, args, context,)
    { 
        const token=context.token 
        try {
            const decoded = jwt.verify(token, "mykey") 
            context.user = decoded
        }
        catch (Error) {
          
            throw new Error('Invalid Credentials jwt ') 
        }
        
    }
}

export default new AuthValidation;