import * as userRepository from "../repositories/userRepository.js";
import urlMetadata from "url-metadata";
import { STATUS_CODE } from "../enums/statusCode.js";

async function getUserData(req, res) {
  const { id } = req.params;

  try {
    const userInfo = (await userRepository.getUserInfo(id)).rows;
    const userPosts = (await userRepository.getUserPosts(id)).rows;

    const { username, pictureUrl } = userInfo[0];

    await Promise.all(
      userPosts.map(async (post) => {
        try {
          const { title, image, description } = await urlMetadata(post.url);
          post.urlTitle = title;
          post.urlImage = image;
          post.urlDescription = description;
        } catch (error) {
          console.error(error, post);
          post.urlTitle = '';
          post.urlImage = '';
          post.urlDescription = '';
        }
      })
    );

    res.status(STATUS_CODE.SUCCESSOK).send({
      username,
      pictureUrl,
      userPosts
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  }
}

async function isFollowed(req, res){
  const userId = res.locals.userId;
  const {followedId} = req.params;

  try {
    const followers = (await userRepository.isFollowed(userId, followedId)).rows;

    return res.status(STATUS_CODE.SUCCESSOK).send(followers);
  } catch (error) {
    console.error(error);
    return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  }
}

async function startFollowing(req, res){
  const {followedId} = req.params;
  const userId = res.locals.userId;

  if(followedId === userId){
    return res.sendStatus(STATUS_CODE.ERRORCONFLICT);
  }

  try {
    await userRepository.startFollowing(userId, followedId);

    return res.sendStatus(STATUS_CODE.SUCCESSCREATED);
  } catch (error) {
    console.error(error);
    return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  }
}

async function stopFollowing(req, res){
  const {followedId} = req.params;
  const userId = res.locals.userId;

  try {
    await userRepository.stopFollowing(userId, followedId);

    return res.sendStatus(STATUS_CODE.SUCCESSNOCONTENT);
  } catch (error) {
    console.error(error);
    return res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
  }
}

export {
  getUserData, isFollowed, startFollowing, stopFollowing
}