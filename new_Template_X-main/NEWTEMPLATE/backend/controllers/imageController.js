import fs from 'fs';
import Image from '../models/imageModel.js'; // Path may vary based on your project structure

// Controller function for handling image uploads
export const uploadImage = async (req, res) => {
  try {
    const { imageData } = req.files;
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Create a new image document
    const newImage = new Image({
      user: req.user._id,
      imageData: {
        data: fs.readFileSync(imageData.path),
        contentType: imageData.mimetype,
      }
    });

    // Save the image document to the database
    await newImage.save();

    res.status(201).json({ success: true, message: 'Image uploaded successfully', imageId: newImage._id });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
};




export const editimage = async (req, res) => {
  try {
    const { imageid } = req.params; // Extract imageid from the request parameters
    const { imageData } = req.files;

    if (!imageData) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Find the existing image document by its ID
    const existingImage = await Image.findById(imageid);

    if (!existingImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Update the existing image data
    existingImage.imageData = {
      data: fs.readFileSync(imageData.path),
      contentType: imageData.mimetype,
    };

    // Save the updated image document to the database
    await existingImage.save();

    res.status(200).json({ success: true, message: 'Image updated successfully', imageId: existingImage._id });
  } catch (error) {
    console.error('Error editing image:', error);
    res.status(500).json({ success: false, error: 'Failed to edit image' });
  }
};

export const getImage = async (req, res) => {
  try {
    const { imageid } = req.params; // Extract imageid from the request parameters

    // Find the image document by its ID
    const image = await Image.findById(imageid);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Send the image data back as a response
    res.set('Content-Type', image.imageData.contentType);
    res.send(image.imageData.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch image' });
  }
};

export const getAllImages = async (req, res) => {
  try {
    // Fetch all images from the database
    const images = await Image.find();

    // Send the images data back as a response
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch images' });
  }
};
