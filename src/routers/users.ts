import express from 'express';
import User from '../models/User';
import parseErrors from '../utils/parseErrors';
import { sendConfirmationEmail } from '../services/mailer';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/', (req, res) => {
    const { email, password } = req.body.user;
    const user = new User({ email, username: email });
    user.setPassword(password);
    user.setConfirmationToken();
    console.error();

    user.save()
        .then((userRecord) => {
            sendConfirmationEmail(userRecord);
            res.json({ user: userRecord.toAuthJSON() });
        })
        .catch((err) =>
            res.status(400).json({ errors: parseErrors(err.errors) }),
        );
});

router.get('/current_user', authenticate, (req, res) => {
    res.json({
        user: {
            email: req.currentUser.email,
            username: req.currentUser.username,
            confirmed: req.currentUser.confirmed,
        },
    });
});

router.get('/test_user', (req, res) => {
    res.json({
        user: {
            email: 'req.currentUser.email',
            username: 'req.currentUser.username',
            confirmed: 'req.currentUser.confirmed',
        },
    });
});

export default router;
