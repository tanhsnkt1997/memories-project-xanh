import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  try {
    const postMessage = await PostMessage.find();
    return res.status(200).json(postMessage);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

export const creatPost = async (req, res) => {
  const post = req.body;
  console.log("vao post", post);
  const newPost = new PostMessage(post);
  try {
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    //https://www.restapitutorial.com/httpstatuscodes.html
    return res.status(409).json({
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  //object destructuring can also rename our properties
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });
  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  await PostMessage.findByIdAndRemove(_id);
  return res.json({ message: "Post deleted successfully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");
  const post = await PostMessage.findById(id);
  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    {
      likeCount: post.likeCount + 1,
    },
    { new: true }
  );
  res.json(updatedPost);
};
