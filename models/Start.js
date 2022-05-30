const mongoose = require('mongoose');


const StartSchema = new mongoose.Schema({
    location: { 
        type: [],
        
       

    },
    weather: {
        type: [],
        
    },
    forecast: { 
            type: [],
            
        
    },
    createdAt: {
        type: Date,
        default: new Date(),
        expires: 3600
        
    },
   
   
  
    
})

module.exports = mongoose.model('Start', StartSchema)