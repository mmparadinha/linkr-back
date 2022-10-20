import searchUsers from "../repositories/searchRepository.js";
import { STATUS_CODE } from "../enums/statusCode";
import { stripHtml } from 'string-strip-html';

export async function getSearchedUsers(req, res) {
    const searchedText = stripHtml(req.locals.search).result;

    try {
        const users = await searchUsers(searchedText);
        res.status(STATUS_CODE.SUCCESSOK).send(users.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(STATUS_CODE.SERVERERRORINTERNAL);
    };
};