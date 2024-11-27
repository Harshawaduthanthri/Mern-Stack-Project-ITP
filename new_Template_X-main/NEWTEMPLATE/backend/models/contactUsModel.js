import mongoose from "mongoose";

// Define the schema for the Contact model
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    queryType: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
}); { timestamps: true }
      
    
    


// Create the Contact model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

// Export the Contact model to be used in other parts of the application
export default Contact;