import connection from "../database/database.js";

async function getPosts() {
    return connection.query(`
    SELECT
    	users.id as "userId",
        users.username,
        users."pictureUrl",
        posts.id as "postId",
        posts.comment,
        posts.url
    FROM
        posts
    JOIN users ON posts."userId" = users.id
    ORDER BY
        posts."createdAt" DESC
    LIMIT
        20;`);
};

async function newPost(userId, url, comment) {
    return connection.query('INSERT INTO posts ("userId", url, comment, "createdAt") VALUES ($1,$2,$3,NOW()) RETURNING id;', [userId, url, comment]);
};

async function newPostsNumber(postId) {
    return connection.query('SELECT COUNT(posts.id) FROM posts WHERE posts.id > $1;', [postId]);
};

export const postRepository = {
    getPosts, newPost, newPostsNumber
};