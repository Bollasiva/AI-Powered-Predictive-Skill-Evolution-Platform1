import express, { Router } from 'express';
import { register, login, getUser } from '../controllers/authController';
import auth from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', auth, getUser);

export default router;