@echo off
rem Script prepare par Claude : recree les conteneurs Docker du projet.
rem Les donnees de la base (volume kdo_pgdata) sont conservees.
cd /d "%~dp0.."
set LOG=%~dp0restart-docker.log
echo Redemarrage des conteneurs en cours...
echo === START %date% %time% > "%LOG%"
echo === down (containers only, volumes kept) >> "%LOG%"
docker compose down --remove-orphans >> "%LOG%" 2>&1
echo === up >> "%LOG%"
docker compose up -d --build --force-recreate --renew-anon-volumes >> "%LOG%" 2>&1
echo === waiting for the API >> "%LOG%"
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
goto logs
:ready
echo API is up >> "%LOG%"
:logs
echo === ps >> "%LOG%"
docker ps -a --filter "label=com.docker.compose.project=kdo" --format "table {{.Names}}\t{{.Status}}\t{{.Networks}}\t{{.Ports}}" >> "%LOG%" 2>&1
echo === backend logs >> "%LOG%"
docker compose logs --no-color --tail 60 backend >> "%LOG%" 2>&1
echo === DONE %date% %time% >> "%LOG%"
echo Termine. Vous pouvez fermer cette fenetre.
pause
