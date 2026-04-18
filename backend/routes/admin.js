import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { password } = z.object({ password: z.string().min(1) }).parse(req.body);
    const hash = process.env.ADMIN_PASSWORD_HASH;
    const plain = process.env.ADMIN_PASSWORD;
    let ok = false;
    if (hash) {
      ok = await bcrypt.compare(password, hash);
    } else if (plain) {
      ok = password === plain;
    } else {
      ok = password === 'admin';
    }
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'dev-secret-change',
      { expiresIn: '7d' }
    );
    res.json({ token, authenticated: true });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors });
    res.status(500).json({ message: e.message });
  }
});

router.get('/check', (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }
  try {
    jwt.verify(header.slice(7), process.env.JWT_SECRET || 'dev-secret-change');
    return res.json({ authenticated: true });
  } catch {
    return res.json({ authenticated: false });
  }
});

router.get('/ping', requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

export default router;
