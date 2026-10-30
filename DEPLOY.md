# Mise en production

Architecture sur le serveur (tout tourne dans Docker) :

```
Internet ──443──> Caddy (HTTPS auto) ──> nginx (frontend) ──/api──> backend ──> Postgres
```

Seul Caddy est ouvert sur Internet. Le site et l'API sont sur le même domaine
(`https://<domaine>` et `https://<domaine>/api`), donc pas de CORS à régler.

## Prérequis

- Un serveur Linux (Debian/Ubuntu) avec accès SSH, ports 80 et 443 ouverts.
- Docker : `curl -fsSL https://get.docker.com | sh`
- Le nom de domaine qui pointe vers l'IP du serveur (enregistrement DNS « A »).
- Un compte SMTP pour les e-mails de réinitialisation de mot de passe.

## Première installation

```bash
git clone https://github.com/RiY0M/K-do.git
cd K-do
cp .env.production.example .env
nano .env                       # remplir DOMAIN, DB_PASSWORD, JWT_SECRET, SMTP_*
docker compose -f compose.prod.yml up -d --build
docker compose -f compose.prod.yml logs -f backend   # migrations + démarrage
```

`JWT_SECRET` se génère avec `openssl rand -hex 32`. Le backend refuse de
démarrer si `JWT_SECRET`, `FRONTEND_URL` ou `DATABASE_URL` manquent, ou si
`SMTP_HOST` est renseigné sans `MAIL_FROM`.

Les migrations Prisma sont appliquées automatiquement à chaque démarrage du
backend (`prisma migrate deploy`).

## Mettre à jour

```bash
git pull
docker compose -f compose.prod.yml up -d --build
```

## Sauvegarder / restaurer la base

```bash
# Sauvegarde (à mettre dans un cron quotidien)
docker compose -f compose.prod.yml exec -T db pg_dump -U kdo kdo | gzip > kdo-$(date +%F).sql.gz

# Restauration
gunzip -c kdo-AAAA-MM-JJ.sql.gz | docker compose -f compose.prod.yml exec -T db psql -U kdo kdo
```

(Remplacer `kdo` par `DB_USER` / `DB_NAME` s'ils sont différents.)

## Commandes utiles

```bash
docker compose -f compose.prod.yml ps          # état des conteneurs
docker compose -f compose.prod.yml logs -f     # tous les journaux
docker compose -f compose.prod.yml restart backend
```

## Développement

Rien ne change : `docker compose up` utilise toujours `compose.yml`
(Vite, nodemon, Mailpit sur http://localhost:8025).
