import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const UploadImageForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null); // Ref for the file input element

  useEffect(() => {
    // Fetch uploaded images when the component mounts
    fetchImages();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('imageData', selectedFile);

      // Post the image to the backend
      const response = await axios.post('http://localhost:8085/api/v1/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Image uploaded successfully:', response.data);
      // Optionally, you can handle success, e.g., show a success message to the user

      // Fetch updated images after successful upload
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  const handleUpdateImage = async (imageId) => {
    // Programmatically trigger file input click
    fileInputRef.current.click();
    // Pass imageId to handleFileInputChange
    handleFileInputChange(imageId);
  };

  const handleFileInputChange = async (imageId) => {
    // When a file is selected, update the image
    if (fileInputRef.current.files && fileInputRef.current.files[0]) {
      const updatedFile = fileInputRef.current.files[0];
      try {
        const formData = new FormData();
        formData.append('imageData', updatedFile);

        // Put the updated image to the backend
        await axios.put(`http://localhost:8085/api/v1/image/upload/${imageId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Fetch updated images after successful update
        fetchImages();
      } catch (error) {
        console.error('Error updating image:', error);
        // Handle error, e.g., show an error message to the user
      }
    }
  };

  const fetchImages = async () => {
    try {
      // Fetch uploaded images from the backend
      const response = await axios.get('http://localhost:8085/api/v1/image/allimages');
      setUploadedImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} ref={fileInputRef} />
        <button type="button" onClick={() => fileInputRef.current.click()}>Choose File</button>
        <button type="submit">Upload</button>
      </form>

      <div>
        <h2>Uploaded Images</h2>
        {uploadedImages.map(image => (
          <div key={image._id}>
            <img src={`http://localhost:8085/api/v1/image/image/${image._id}`} alt="Uploaded" style={{ width: '200px', height: 'auto', margin: '10px' }} />
            <button onClick={() => handleUpdateImage(image._id)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadImageForm;
