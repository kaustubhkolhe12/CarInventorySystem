import { app } from './app';
import { initializeDatabase } from './database';

const PORT = process.env.PORT || 3000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Car inventory API running on http://localhost:${PORT}`);
  });
});
