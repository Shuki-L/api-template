import express = require('express');
import { Response, ResponseStatus } from '../entities';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const response = { message: 'POST: im here' };
        res.status(201).json(response);
    } catch (error) {
        const statusCode = error.Code || 500;
        const response = new Response(
            ResponseStatus.Error,
            `error occured while posting test`,
        );
        res.status(statusCode).json(response);
    }
});

router.get('/', async (req, res) => {
    try {
        const response = { message: 'GET: im here' };
        res.status(200).json(response);
    } catch (error) {
        const statusCode = error.Code || 500;
        const response = new Response(
            ResponseStatus.Error,
            `error occured while getting test`,
        );
        res.status(statusCode).json(response);
    }
});
module.exports = router;
