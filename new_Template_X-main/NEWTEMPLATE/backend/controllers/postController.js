import PostModel from '../models/postsModel.js';
import slugify from 'slugify';

export const createPostController = async (req, res) => {
    try {
        const { topic, description, category } = req.body;

        const existingTopicPost = await PostModel.findOne({ topic });

        if (existingTopicPost) {
            return res.status(200).json({
                success: true,
                message: "Topic already exists",
            });
        }

        const newPost = new PostModel({
            topic,
            slug: slugify(topic),
            description,
            category,
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: 'Post successfully created',
            data: newPost,
        });
    } catch (error) {
        console.error(error);

        let errorMessage = 'Error in creating the post';
        let statusCode = 500;

        if (error.name === 'ValidationError') {
            errorMessage = 'Validation error. Please check your input.';
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            error,
            message: errorMessage,
        });
    }
};

export const getPostController = async (req, res) => {
    try {
        const posts = await PostModel.find({});

        res.status(200).json({
            success: true,
            message: 'All posts retrieved successfully',
            data: posts,
        });
    } catch (error) {
        console.error(error);

        let errorMessage = 'Error in getting the posts';
        let statusCode = 500;

        if (error.name === 'ValidationError') {
            errorMessage = 'Validation error. Please check your input.';
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            error,
            message: errorMessage,
        });
    }
};

export const getSinglePostController = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'One post retrieved successfully',
            data: post,
        });
    } catch (error) {
        console.error(error);

        let errorMessage = 'Error in getting the post';
        let statusCode = 500;

        if (error.name === 'ValidationError') {
            errorMessage = 'Validation error. Please check your input.';
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            error,
            message: errorMessage,
        });
    }
};


export const updatePostController = async (req, res) => {
    try {
        const postId = req.params.id;
        const { topic, description, category } = req.body;

        // Perform validation or any necessary checks before updating

        // Assuming you have a PostModel
        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { topic, description, category },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: updatedPost,
        });
    } catch (error) {
        console.error(error);

        let errorMessage = 'Error in updating the post';
        let statusCode = 500;

        if (error.name === 'ValidationError') {
            errorMessage = 'Validation error. Please check your input.';
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            error,
            message: errorMessage,
        });
    }
};

export const deletePostController = async (req, res) => {
    try {
        const postId = req.params.id;

        // Assuming you have a PostModel
        const deletedPost = await PostModel.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
            data: deletedPost,
        });
    } catch (error) {
        console.error(error);

        let errorMessage = 'Error in deleting the post';
        let statusCode = 500;

        if (error.name === 'ValidationError') {
            errorMessage = 'Validation error. Please check your input.';
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            error,
            message: errorMessage,
        });
    }

};

// Add imports if necessary

export const reactToPostController = async (req, res) => {
    try {
        const postId = req.params.id;
        const { reactionType } = req.body;

        // Find the post by id
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Update the reactions based on the reactionType
        if (reactionType === 'like') {
            post.likes += 1;
        } else if (reactionType === 'heart') {
            post.hearts += 1;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid reaction type',
            });
        }

        // Save the updated post
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Reaction added successfully',
            data: post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error,
            message: 'Error in reacting to post',
        });
    }
};

export const getPostsLikes = async (req, res) => {
    try {
      const posts = await PostModel.find({}, 'topic likes').exec();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
  
// controllers/postController.js
export const getTopPostLikesData = async (req, res) => {
    try {
      const topPostLikesData = await PostModel.find({}, 'topic likes')
        .sort({ likes: -1 })
        .limit(5);
  
      res.json(topPostLikesData);
    } catch (error) {
      console.error('Error fetching top post likes data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCategoryCountData = async (req, res) => {
    try {
      const categoryCountData = await PostModel.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]);
  
      res.json(categoryCountData);
    } catch (error) {
      console.error('Error fetching category count data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

