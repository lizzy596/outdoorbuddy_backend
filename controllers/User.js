const User = require('../models/User')
const {createCustomError} = require('../errors/custom-error')
const asyncWrapper = require('../middleware/async')
const axios = require('axios')




const Login = asyncWrapper(async (req, res, next) => {

 
    const { username, password } = req.body
    if(!username || !password ) {
        //return res.status(404).json({ message: "Provide Username and Password" });

        return next(createCustomError('Provide Username and Password!!', 401))
    }

    try {

        const user = await User.findOne({ username })
        //compare password
      
        if(!user) {
           // return res.status(404).json({ message: "Invalid Credentials" });
            return next(createCustomError('Invalid Credentials!', 402))
        }
      
        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect) {
            //return res.status(404).json({ message: "Invalid Credentials" });
            return next(createCustomError('Invalid Credentials!', 402))
        }
      
      
        const token = user.createJWT()
        res.status(200).json({ result: user,  token})






        
    } catch (error) {

        res.status(500).json({ message: "Something went wrong" });
        
    }
  
})

const headers = {
    'Content-Type': 'application/json',
    'X-Mybring-API-Uid': 'lizmeek123@gmail.com',
    'X-Mybring-API-Key': 'f85f922c-2ba4-4165-957b-3ea27e9ff632',
  }; 
  

const checkZip = async (zipcode) => {
    try {

    const { data } = await axios.get(`
    https://api.bring.com/pickuppoint/api/postalCode/US/getCityAndType/${zipcode}.json`, {headers})
    
    return true
        
    } catch (error) {
      return false  
    }
}
  
  
  
const Register = asyncWrapper (async (req, res, next) => {

    const { username, password, confirmPassword, zipcode } = req.body;


    const existingUser= await User.findOne({ username });
        
        if (existingUser) return next(createCustomError('User already exists!!', 401))

      if(password !== confirmPassword) return next(createCustomError('Passwords do not match!!', 400))

        const checker = await checkZip(zipcode)
        if(!checker) return next(createCustomError('Enter a valid zipcode!!', 405))


        const result = await User.create({ ...req.body  })
        const token = result.createJWT()
        res.status(201).json({ result, token });
        


 }) 





module.exports = {
    Register,
    Login
}