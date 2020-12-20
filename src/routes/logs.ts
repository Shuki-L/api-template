import express = require('express');
import { Response, ResponseStatus } from '../entities';
import AWSCloudWatchLogs from '../services/awsCloudWatchLogs';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const response = { message: 'POST: im here' };
        res.status(201).json(response);
    } catch (error) {
        const statusCode = error.Code || 500;
        const response = new Response(
            ResponseStatus.Error,
            `error occured while posting logs`,
        );
        res.status(statusCode).json(response);
    }
});

router.get('/', async (req, res) => {
    try {
        const cluster = req.query.cluster;
        const service = req.query.service;
        const region = req.query.region;
        const env = cluster.includes('dev') ? 'dev' : 'prod';
        const max_events = req.query.max_events || 50;
        const logGroupName = `${cluster}-${env}-${service}-${region}`;

        const cloudWatchLogs = new AWSCloudWatchLogs({ region });
        const logs = await cloudWatchLogs.getLatestLogEvents(
            logGroupName,
            max_events,
        );
        res.status(200).json({ service, logs });
    } catch (error) {
        const statusCode = error.Code || 500;
        const response = new Response(
            ResponseStatus.Error,
            `error occured while getting logs`,
        );
        res.status(statusCode).json(response);
    }
});
module.exports = router;
