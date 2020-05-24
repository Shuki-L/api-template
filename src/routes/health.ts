import express = require('express');
import { ROUTE } from './constants';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        description: ROUTE.HEALTH.MESSAGE.OK,
        status: 200,
    });
});

module.exports = router;
