## Agent News → Telegram

Application Next.js qui collecte automatiquement des actualités Google News pour un sujet donné, affiche les résultats et permet de publier instantanément un résumé formaté dans un canal ou groupe Telegram via un bot.

### Configuration

1. Renommez `.env.example` en `.env.local` et renseignez vos identifiants Telegram :
   ```bash
   TELEGRAM_BOT_TOKEN=<votre_token_bot>
   TELEGRAM_CHAT_ID=<id_du_canal_ou_groupe>
   ```
   - `TELEGRAM_CHAT_ID` peut être négatif pour un supergroupe ou un canal.
   - Ajoutez le bot à la conversation et donnez-lui les droits d'écriture.

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

4. Ouvrez `http://localhost:3000` et lancez une recherche.

### Scripts

- `npm run dev` : serveur de développement
- `npm run build` : build de production
- `npm run start` : démarre le serveur de production (après `build`)
- `npm run lint` : exécute ESLint
- `npm run typecheck` : vérifie les types TypeScript

### Déploiement sur Vercel

1. Assurez-vous d’avoir configuré les variables d’environnement Telegram sur Vercel (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
2. Construisez en local (`npm run build`) puis déployez.
