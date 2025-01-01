# How To Use this Project

This project is a **Pnpm Workspace** powered by **Nx**. The Workspace consists of:

- **UI:** `./apps/ui` and `./apps/ui-e2e` containing an **Angular 18 Standalone App** with SSG (Server Side Generation) support, **Esbuild** as a bundler, **Cypress** as a test suite, **Sass** and **Tailwind** for styles, and support for reactive programming using **Rx.js**.
- **API:** `./apps/api` and `./apps/api-e2e` containing a **Nestjs 10 Server** based on the **Express Platform**, **Prisma** as ORM, and **CASL** as an Auth Middleware.

## How to use the UI

1. **To Run the UI:**
    1. Run the API first.
    2. Once the API is up and running, run these commands:
        - **Dev Mode:**  

          ```bash
          pnpm nx serve ui
          ```  

        - **Prod Mode:**  

          ```bash
          pnpm nx build ui && pnpm nx start ui
          ```

2. **To Run the UI Tests:**  

    ```bash
    pnpm nx e2e ui-e2e
    ```

3. **To Lint the UI:**  

    ```bash
    pnpm nx lint ui
    ```

4. **To Format the UI:**  

    ```bash
    pnpm nx format ui
    ```

## How to use the API

1. **To Run the API:**
    1. Open a separate terminal, go to the `./docker` directory, and then run the command:

       ```bash
       docker compose up
       ```

    2. Once the Docker containers are up and running, run these commands:
        - **Dev Mode:**  

          ```bash
          pnpm nx serve api
          ```

        - **Prod Mode:**  

          ```bash
          pnpm nx build api && pnpm nx start api
          ```

2. **To Run the API Tests:**  

    ```bash
    pnpm nx e2e api-e2e
    ```

3. **To Lint the API:**  

    ```bash
    pnpm nx lint api
    ```

4. **To Format the API:**  

    ```bash
    pnpm nx format api
    ```

## Docker Structure

This project includes a **Docker Compose** setup. Docker Compose is used to manage the database and pgAdmin services, ensuring the API has a ready-to-use PostgreSQL environment with a web-based admin interface.

The setup includes the following services:

- **Database Service:**
  - **Image:** `postgres:17.2-alpine3.21`
  - Exposes PostgreSQL on port `5432`.
  - Configured with:
    - Database: `ElMarchi`
    - User: `admin`
    - Password: `password`
  - Uses a persistent volume (`postgres_data`) to store data.

- **pgAdmin Service:**
  - **Image:** `dpage/pgadmin4:8.14.0`
  - Exposes the pgAdmin web interface on port `5050`.
  - Configured with default credentials:
    - Email: `admin@admin.com`
    - Password: `admin`
  - Depends on the database service to ensure the database is running first.

- **Volume:**
  - `postgres_data`: Stores the PostgreSQL database data persistently.

### To Start the Services

1. Navigate to the `./docker` directory:

   ```bash
   cd ./docker
   ```

2. Start the services:

   ```bash
   docker compose up
   ```

### To Stop the Services

To stop and remove the running containers:

```bash
docker compose down
```

### Cleanup Docker Volumes

If you want to remove the persistent volume data:

```bash
docker volume rm postgres_data
```

## Troubleshooting

- **Port Conflicts:**  
  If you encounter a port conflict, update the `ports` section in `docker-compose.yml`.  
  Example: Change `5050:80` to `6060:80`.

- **Database Connection Issues:**  
  Ensure the database service is running by checking the containers with:

  ```bash
  docker ps
  ```

- **Reset pgAdmin Credentials:**  
  If you forget the pgAdmin credentials, update them in the `docker-compose.yml` file and restart the containers.
