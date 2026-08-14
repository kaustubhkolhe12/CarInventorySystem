import express, { Request, Response } from 'express';
import db from './database';

const app = express();

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/users', (_req: Request, res: Response) => {
  const users = db.prepare('SELECT * FROM users ORDER BY id DESC').all();
  res.status(200).json(users);
});

app.post('/api/users', (req: Request, res: Response) => {
  const { username, emailId, password } = req.body as {
    username?: string;
    emailId?: string;
    password?: string;
  };

  if (!username || !emailId || !password) {
    return res.status(400).json({ message: 'Username, emailId and password are required.' });
  }

  try {
    const insert = db.prepare(
      'INSERT INTO users (username, emailId, password) VALUES (?, ?, ?)'
    );
    const result = insert.run(username, emailId, password);

    const createdUser = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(result.lastInsertRowid) as { id: number; username: string; emailId: string; password: string };

    return res.status(201).json(createdUser);
  } catch (error) {
    return res.status(409).json({ message: 'User already exists or invalid data.' });
  }
});

app.get('/api/users/email/:keyword', (req: Request, res: Response) => {
  const keyword = String(req.params.keyword ?? '').toLowerCase();
  const users = db
    .prepare('SELECT * FROM users WHERE LOWER(emailId) LIKE ? ORDER BY id DESC')
    .all(`%${keyword}%`);

  res.status(200).json(users);
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id));

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json(user);
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, emailId, password } = req.body as {
    username?: string;
    emailId?: string;
    password?: string;
  };

  const existingUser = db
    .prepare('SELECT * FROM users WHERE id = ?')
    .get(Number(id)) as
    | { id: number; username: string; emailId: string; password: string }
    | undefined;

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUsername = username ?? existingUser.username;
  const updatedEmailId = emailId ?? existingUser.emailId;
  const updatedPassword = password ?? existingUser.password;

  const result = db.prepare(
    'UPDATE users SET username = ?, emailId = ?, password = ? WHERE id = ?'
  ).run(updatedUsername, updatedEmailId, updatedPassword, Number(id));

  if (result.changes === 0) {
    return res.status(400).json({ message: 'User could not be updated' });
  }

  const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id));
  return res.status(200).json(updatedUser);
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(Number(id));

  if (result.changes === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ message: 'User deleted successfully' });
});

export { app };
