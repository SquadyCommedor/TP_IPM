import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'meu-guia-cabeleireiro-secret-key-2026';

app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'parent' | 'child';
  childProfile?: {
    nickname: string;
    age: number;
    hairColor: string;
    characterSkin: string;
    stars: number;
    completedScenes: string[];
    completedVisits: number;
    diplomaEarned: boolean;
  };
  createdAt: string;
}

const users: Map<string, User> = new Map();

// Middleware
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    (req as any).userId = user.userId;
    next();
  });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, childNickname, childAge } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Dados incompletos' });
    }

    // Check if email exists
    for (const user of users.values()) {
      if (user.email === email) {
        return res.status(409).json({ message: 'Email já registado' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const newUser: User = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      role,
      childProfile: role === 'child' ? {
        nickname: childNickname || name,
        age: childAge || 7,
        hairColor: 'brown',
        characterSkin: 'neutral1',
        stars: 0,
        completedScenes: [],
        completedVisits: 0,
        diplomaEarned: false,
      } : undefined,
      createdAt: new Date().toISOString(),
    };

    users.set(userId, newUser);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Dados incompletos' });
    }

    const user = Array.from(users.values()).find(u => u.email === email && u.role === role);

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const userId = (req as any).userId;
  const user = users.get(userId);

  if (!user) {
    return res.status(404).json({ message: 'Utilizador não encontrado' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
