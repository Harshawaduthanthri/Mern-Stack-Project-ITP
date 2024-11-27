import express from 'express';
import {  editimage, getAllImages, getImage, uploadImage } from '../controllers/imageController.js';
import formidable from 'express-formidable';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/upload',requireSignIn, formidable(), uploadImage);
router.put('/upload/:imageid', formidable(), editimage);
router.get('/image/:imageid', getImage);
router.get('/allimages', getAllImages);


export default router;
