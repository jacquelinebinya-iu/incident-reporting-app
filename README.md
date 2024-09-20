# Incident Reporting App

## Project Setup

### Requirements
- **Node.js**: v20.x.x
- **npm**: v7.x.x or higher
- **PostgreSQL**: Ensure you have PostgreSQL installed and running.

### 1. Clone the Repository
```bash
git clone <repository-url>
```

### 2. Backend Setup
1. Navigate to the server directory:
    ```bash
    cd incident-reporting-app/server
    ```
2. Create a `.env` file and copy the contents from `.env.example`:
    ```bash
    cp .env.example .env
    ```
3. Open the `.env` file and set your own values, including specifying the database name.
4. Create a PostgreSQL database with the name specified in your `.env` file:
    ```sql
    CREATE DATABASE your_database_name;
    ```
5. Install the required dependencies:
    ```bash
    npm i
    ```
6. Start the server:
    ```bash
    npm start
    ```

### 3. Frontend Setup
1. Navigate to the UI directory:
    ```bash
    cd incident-reporting-app/client
    ```
2. Install the required dependencies:
    ```bash
    npm i
    ```
3. Start the app:
    ```bash
    npm run develop
    ```
4. Navigate to `http://localhost:5173/` in your browser to access the app.
