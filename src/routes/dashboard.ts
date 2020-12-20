import express = require('express');
import { Response, ResponseStatus } from '../entities';
import ClusterServices from '../services/clusterServices';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // const dashboardData = {
        //     cluster: {
        //         name: 'SIT-02-DEV',
        //         instances: [
        //             { ip: '111.111.1.1', services: [{ name: 'sit-svc-reporting-api' }, { name: 'sit-svc-provision-api' }] },
        //             { ip: '222.222.2.2', services: [{ name: 'sit-svc-devices' }, { name: 'sit-svc-user-devices' }] },
        //         ],
        //     },
        // };
        const clusterArn =
            'arn:aws:ecs:eu-west-1:995121555896:cluster/sit-dev-02';
        const clusterName = 'sit-dev-02';
        const region = 'eu-west-1';
        const clusterServices = new ClusterServices({ region });
        const cluster = await clusterServices.getClusterinfo(
            clusterArn,
            clusterName,
        );
        res.status(200).json({ cluster });
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
