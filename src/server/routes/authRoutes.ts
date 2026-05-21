import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Example protected route to test middleware
router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

export default router;
