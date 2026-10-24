@echo off
rem Script prepare par Claude : met a jour les dependances npm, verifie le code
rem (typecheck, lint, build) puis teste l'application avec Docker.
rem Tout est journalise dans claude-scripts\update-and-test.log
cd /d "%~dp0.."
set ROOT=%cd%
set LOG=%~dp0update-and-test.log
echo Mise a jour et tests en cours, ne fermez pas cette fenetre...
echo Journal : %LOG%
echo === START %date% %time% > "%LOG%"
echo === versions >> "%LOG%"
node -v >> "%LOG%" 2>&1
call npm -v >> "%LOG%" 2>&1

echo === [backend] outdated (before) >> "%LOG%"
cd /d "%ROOT%\backend"
call npm outdated >> "%LOG%" 2>&1
echo === [backend] install >> "%LOG%"
call npm install --no-fund --no-audit fastify@latest @fastify/cors@latest @fastify/jwt@latest @fastify/sensible@latest @fastify/swagger@latest @fastify/swagger-ui@latest bcrypt@latest dotenv@latest fastify-plugin@latest fastify-type-provider-zod@latest openapi-types@latest zod@latest nodemailer@latest prisma@^6 @prisma/client@^6 >> "%LOG%" 2>&1
call npm install --no-fund --no-audit -D typescript@~6.0 esbuild@latest @types/node@^22 @types/bcrypt@latest @tsconfig/node22@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest eslint-config-prettier@latest eslint-plugin-prettier@latest globals@latest nodemon@latest prettier@latest tsx@latest c8@latest >> "%LOG%" 2>&1
echo === [backend] prisma generate >> "%LOG%"
call npx prisma generate >> "%LOG%" 2>&1
echo === [backend] typecheck >> "%LOG%"
call npm run typecheck >> "%LOG%" 2>&1
echo === [backend] lint >> "%LOG%"
call npm run lint >> "%LOG%" 2>&1
echo === [backend] build >> "%LOG%"
call npm run build >> "%LOG%" 2>&1

echo === [frontend] outdated (before) >> "%LOG%"
cd /d "%ROOT%\frontend"
call npm outdated >> "%LOG%" 2>&1
echo === [frontend] install >> "%LOG%"
call npm install --no-fund --no-audit react@latest react-dom@latest react-router-dom@latest >> "%LOG%" 2>&1
call npm install --no-fund --no-audit -D vite@latest @vitejs/plugin-react@latest typescript@~6.0 eslint@latest @eslint/js@latest eslint-plugin-react-hooks@latest eslint-plugin-react-refresh@latest typescript-eslint@latest globals@latest @types/react@latest @types/react-dom@latest @types/node@^22 >> "%LOG%" 2>&1
echo === [frontend] typecheck >> "%LOG%"
call npm run typecheck >> "%LOG%" 2>&1
echo === [frontend] lint >> "%LOG%"
call npm run lint >> "%LOG%" 2>&1
echo === [frontend] build >> "%LOG%"
call npm run build >> "%LOG%" 2>&1

echo === [docker] >> "%LOG%"
cd /d "%ROOT%"
docker info >nul 2>&1
if errorlevel 1 (
  echo Docker Desktop n'est pas lance : tests Docker ignores >> "%LOG%"
  goto end
)
docker compose down --remove-orphans >> "%LOG%" 2>&1
docker compose up -d --build --force-recreate --renew-anon-volumes >> "%LOG%" 2>&1
echo === [docker] waiting for the API >> "%LOG%"
set /a TRIES=0
:wait
set /a TRIES+=1
curl -s http://localhost:3000/api/ping >nul 2>&1
if not errorlevel 1 goto ready
if %TRIES% GEQ 60 goto notready
timeout /t 5 /nobreak >nul
goto wait
:notready
echo API not reachable after 5 minutes >> "%LOG%"
docker compose logs --tail 80 backend >> "%LOG%" 2>&1
goto end
:ready
echo === [docker] backend logs >> "%LOG%"
docker compose logs --tail 40 backend >> "%LOG%" 2>&1
echo === [smoke test] >> "%LOG%"
node "%~dp0smoke-test.mjs" >> "%LOG%" 2>&1

:end
echo === DONE %date% %time% >> "%LOG%"
echo Termine. Vous pouvez fermer cette fenetre.
pause
