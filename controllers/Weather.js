const axios = require('axios')
const mongoose = require('mongoose')
const Start = require('../models/Start')
const {createCustomError} = require('../errors/custom-error')
const asyncWrapper = require('../middleware/async')







const getLocationKey = async (city) => {
try {
      const { data } = await axios.get(`http://dataservice.accuweather.com/locations/v1/postalcodes/US/search?apikey=${process.env.KEY}&q=${city}`, {mode: 'cors'});
            //return data[0].Key
return data
  }
  catch (error) {
console.error(error);
}
} 




const getWeatherConditions = async (id) => {
   // const base = `https://dataservice.accuweather.com/currentconditions/v1/${id}?apikey=${process.env.Key}`;
    //const query = `${id}?apikey=${process.env.Key}`;
  try {

    const { data } = await axios.get(`https://dataservice.accuweather.com/currentconditions/v1/${id}?apikey=${process.env.KEY}` , {mode: 'cors'});
    
    return data
      
  } catch (error) {

    console.error(error);
      
  }
   
    
    
}


const getForecast = async (id) => {
    try {
      const { data } = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${id}?apikey=${process.env.KEY}&details=true` , {mode: 'cors'});

      return data 

    } catch (error) {
      console.error(error);
    }
}



const headers = {
  'Content-Type': 'application/json',
  'X-Mybring-API-Uid': process.env.EMAIL,
  'X-Mybring-API-Key': process.env.BRINGKEY,
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





 const getWeather = asyncWrapper(async (req, res, next) => {
    const { searchQuery } = req.query;

    const checker = await checkZip(searchQuery)
    if(!checker) return next(createCustomError('Enter a valid zipcode!!', 405))

      const location = await getLocationKey(searchQuery)
      const weather = await getWeatherConditions(location[0].Key)
    
     //const forecast = await getForecast('34445_PC')
     const  forecast = await getForecast(location[0].Key)
     await Start.deleteMany({})
     
     const newStart = await Start.create({ location: location[0], weather: weather[0], forecast  })
   
     await newStart.save()
   
     const startKey = 'hello'
     
     res.status(200).json({ location: location[0], weather: weather[0], forecast:forecast.DailyForecasts[0], startKey })
     }) 


     /*const getWeather = async (req, res) => {
      //const { searchQuery } = req.query;

      const { zipcode } = req.body


      try {

        const location = await getLocationKey(zipcode)
        const weather = await getWeatherConditions(location[0].Key)
      
       //const forecast = await getForecast('34445_PC')
       const  forecast = await getForecast(location[0].Key)
      await Start.deleteMany({})
       
       const newStart = await Start.create({ location: location[0], weather: weather[0], forecast  })
     
      await newStart.save()
     
      const startKey = 'hello'

   
       
       res.status(200).json({ location: location[0], weather: weather[0], forecast:forecast.DailyForecasts[0], startKey })
        
      } catch (error) {
        console.log(error)
      }
  
      //const checker = await checkZip(searchQuery)
      //if(!checker) return next(createCustomError('Enter a valid zipcode!!', 405))
  
        
       } */





 const getStartData = async (req, res) => {
    try {
      const data = await Start.find()
      
      res.status(200).json(data)
      
    } catch (error) {
      console.log(error)
    }



}



module.exports = {
   getWeather,
   getStartData
    
}