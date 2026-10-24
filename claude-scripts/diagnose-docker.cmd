@echo off
rem Script prepare par Claude : diagnostic Docker (lecture seule, ne modifie rien)
cd /d "%~dp0.."
set LOG=%~dp0diagnose-docker.log
echo Diagnostic en cours...
(
echo === docker version
docker version --format "client {{.Client.Version}} / server {{.Server.Version}}"
docker compose version
echo === compose ps -a
docker compose ps -a
echo === all containers
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Networks}}\t{{.Label \"com.docker.compose.project\"}}"
echo === networks
docker network ls
echo === compose config (services, networks, depends_on)
docker compose config --format json
echo === db logs
docker compose logs --no-color --tail 60 db
echo === backend logs
docker compose logs --no-color --tail 60 backend
echo === backend: resolve db
docker compose exec -T backend getent hosts db
echo === backend: tcp db:5432
docker compose exec -T backend node -e "require('net').connect(5432,'db').on('connect',function(){console.log('connected');process.exit(0)}).on('error',function(e){console.log('error',e.message);process.exit(1)})"
echo === backend: env
docker compose exec -T backend sh -c "env | grep -E 'DATABASE_URL|NODE_ENV' | sed 's/:[^:@]*@/:***@/'"
echo === db: pg_isready
docker compose exec -T db pg_isready
echo === DONE
) > "%LOG%" 2>&1
echo Termine. Vous pouvez fermer cette fenetre.
pause
