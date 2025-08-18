---
applyTo: "docker-compose.yml,docker-compose.*.yml,Dockerfile,Dockerfile.*,**/*.docker.*"
description: "Docker and containerization patterns for idn-area API"
---

# Docker Patterns
- **Production image**: Test files excluded, multi-stage build
- **Testing strategy**: Test before build (host-based E2E with containerized DB)
- **Database connection**: Use `db:5432` in containers, `localhost:5432` from host

# Key Commands
```bash
# Start database only (for development/testing)
docker compose up -d db

# E2E testing from host
DB_HOST=localhost pnpm test:e2e

# Full deployment
docker compose up -d
```

# Common Issues
- **E2E tests fail**: Use `DB_HOST=localhost` for host-based testing
- **Port conflicts**: `docker compose down` then restart
