import express = require('express');
import { Response, ResponseStatus } from '../entities';
import AWS = require('aws-sdk');
import AwsECS from '../services/awsECS';
import ClusterServices from '../services/clusterServices';

const router = express.Router();

const params = {};

router.get('/', async (req, res) => {
    try {
        const region = req.query.region || 'eu-west-1';
        const clusterArn = req.query.clusterArn;
        const clusterName = req.query.clusterName;
        const clusterService = new ClusterServices({ region });
        const clutersinfoRes = await clusterService.getClusterinfo(clusterArn, clusterName);
        const response = { ecs_clustres: clutersinfoRes };
        res.status(200).json(response);
    } catch (error) {
        const statusCode = error.Code || 500;
        const response = new Response(ResponseStatus.Error, `error occured while getting test`);
        res.status(statusCode).json(response);
    }
});
module.exports = router;
