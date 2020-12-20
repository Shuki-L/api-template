import express = require('express');
import { Response, ResponseStatus } from '../entities';
import ClusterServices from '../services/clusterServices';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const region = req.query.region || 'eu-west-1';
        const cluster =
            req.query.cluster ||
            'arn:aws:ecs:eu-west-1:995121555896:cluster/sit-dev-02';
        const containerInstances = req.query.container || [
            '05d1f6dd-4904-4372-b51e-fca5d6835fbf',
            '1bb865d0-fdf0-4e58-bee0-ea2efcf6d0b1',
            '45cfaeac-d989-4418-b349-6ca7b29cf8de',
            '94edf32e-24b2-4d39-8e7b-dfaf880fb422',
            'd0473f4e-92dd-4a05-a297-d2211d226539',
            'ee3ccb52-5b52-4372-b896-3d47c84434c8',
        ];
        const clusterService = new ClusterServices({ region });
        const statusesRes = await clusterService.getTaskStatuses(
            cluster,
            containerInstances,
        );
        const response = { statuses: statusesRes };
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
