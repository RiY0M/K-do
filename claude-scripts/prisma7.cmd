@echo off
rem Script prepare par Claude : migration vers Prisma 7 puis verifications
rem (generate, typecheck, lint, build, stack Docker de dev + tests de l'API,
rem image de production). Journal : claude-scripts\prisma7.log
cd /d "%~dp0.."
set ROOT=%cd%
set LOG=%~dp0prisma7.log
echo Migration Prisma 7 en cours, ne fermez pas cette fenetre...
echo === START %date% %time% > "%LOG%"

rem Variables du .env racine (DB_USER, DB_PASSWORD, DB_NAME...)
for /f "usebackq eol=# tokens=1,* delims==" %%a in ("%ROOT%\.env") do set "%%a=%%b"

cd /d "%ROOT%\backend"
echo === [backend] install >> "%LOG%"
call npm install --no-fund --no-audit prisma@^7 @prisma/client@^7 @prisma/adapter-pg@^7 >> "%LOG%" 2>&1
echo === [backend] versions >> "%LOG%"
call npx prisma --version >> "%LOG%" 2>&1
echo === [backend] validate >> "%LOG%"
call npx prisma validate >> "%LOG%" 2>&1
echo === [backend] generate >> "%LOG%"
call npx prisma generate >> "%LOG%" 2>&1
echo === [backend] typecheck >> "%LOG%"
call npm run typecheck >> "%LOG%" 2>&1
echo === [backend] lint >> "%LOG%"
call npm run lint >> "%LOG%" 2>&1
echo === [backend] build >> "%LOG%"
call npm run build >> "%LOG%" 2>&1

cd /d "%ROOT%"
docker info >nul 2>&1
if errorlevel 1 (
  echo Docker Desktop n'est pas lance : tests Docker ignores >> "%LOG%"
  goto end
)

echo === [docker dev] >> "%LOG%"
docker compose down --remove-orphans >> "%LOG%" 2>&1
docker compose up -d --build --force-recreate --renew-anon-volumes >> "%LOG%" 2>&1
set /a TRIES=0
:waitdev
set /a TRIES+=1
curl -s http://localhost:3000/api/ping >nul 2>&1
if not errorlevel 1 goto readydev
if %TRIES% GEQ 60 goto notreadydev
timeout /t 5 /nobreak >nul
goto waitdev
:notreadydev
echo API not reachable after 5 minutes >> "%LOG%"
docker compose logs --no-color --tail 80 backend >> "%LOG%" 2>&1
goto prod
:readydev
echo === [docker dev] backend logs >> "%LOG%"
docker compose logs --no-color --tail 40 backend >> "%LOG%" 2>&1
echo === [smoke test] >> "%LOG%"
node "%~dp0smoke-test.mjs" >> "%LOG%" 2>&1

:prod
echo === [docker prod] build image >> "%LOG%"
docker build -f backend\Dockerfile.prod -t kdo-backend-prod-test backend >> "%LOG%" 2>&1
if errorlevel 1 goto end
echo === [docker prod] run against the dev database >> "%LOG%"
docker rm -f kdo-backend-prod-test >nul 2>&1
docker run -d --name kdo-backend-prod-test --network kdo_default -p 3100:3000 -e NODE_ENV=production -e DATABASE_URL=postgresql://%DB_USER%:%DB_PASSWORD%@db:5432/%DB_NAME% -e JWT_SECRET=prod-test-secret-0123456789abcdef0123456789 -e FRONTEND_URL=https://kdo.example.test kdo-backend-prod-test >> "%LOG%" 2>&1
set /a TRIES=0
:waitprod
set /a TRIES+=1
curl -s http://localhost:3100/api/ping >nul 2>&1
if not errorlevel 1 goto readyprod
if %TRIES% GEQ 24 goto notreadyprod
timeout /t 5 /nobreak >nul
goto waitprod
:notreadyprod
echo Prod API not reachable after 2 minutes >> "%LOG%"
goto prodlogs
:readyprod
echo Prod API is up >> "%LOG%"
echo === [docker prod] smoke test >> "%LOG%"
set API_URL=http://localhost:3100/api
node "%~dp0smoke-test.mjs" >> "%LOG%" 2>&1
set API_URL=
:prodlogs
echo === [docker prod] logs >> "%LOG%"
docker logs --tail 40 kdo-backend-prod-test >> "%LOG%" 2>&1
docker rm -f kdo-backend-prod-test >> "%LOG%" 2>&1

:end
echo === DONE %date% %time% >> "%LOG%"
echo Termine. Vous pouvez fermer cette fenetre.
pause
