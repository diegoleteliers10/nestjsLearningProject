-- TaskFlow Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create database (already created by POSTGRES_DB environment variable)
-- But we can add any additional setup here

-- Create any additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS taskflow;

-- Grant permissions to the user
GRANT ALL PRIVILEGES ON DATABASE taskflow_db TO taskflow_user;

-- You can add initial table creation scripts here
-- For example:
-- CREATE TABLE IF NOT EXISTS tasks (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     description TEXT,
--     status VARCHAR(50) DEFAULT 'pending',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Add any initial data here
-- INSERT INTO tasks (title, description) VALUES ('Sample Task', 'This is a sample task');

-- Print completion message
SELECT 'TaskFlow database initialized successfully!' AS message;
