import mongoose from "mongoose";
const { model, Schema } = mongoose;
const post_likes = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts',
            required: true
        },
        likes: {
            type: String,
            required: true
        }
    }, 
    {
        timestamps: true
    }
)

const postLikes = model('PostLikes', post_likes);

export default postLikes;