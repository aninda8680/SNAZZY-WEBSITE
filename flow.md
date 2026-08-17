# Project Flow and Architecture

## Overview
This document outlines the folder structure and architectural flow of the Snazzy Website project. The project is split into a modern frontend, a backend API, and a database layer.

## Folder Structure

### 1. Frontend Architecture
The frontend is primarily built using React, TypeScript, and Vite, but it also includes dedicated folders for basic assets.

*   **`/src`**: The core React application directory. It contains reusable components, page sections, hooks, utils, and global constants. (Detailed breakdown available in `STRUCTURE.md`).
*   **`/js`**: Contains vanilla JavaScript files (e.g., `main.js`). Used for scripts that might run outside the React context, legacy scripts, or standalone third-party integrations.
*   **`/css`**: Contains global stylesheets (e.g., `styles.css`). While the project utilizes Tailwind CSS (indicated by `tailwind.config.js`), this folder holds custom vanilla CSS styles, animations, or overrides that fall outside of utility classes.
*   **`/public`** & **`/assets`**: Directories for static files like images, fonts, and icons that are served directly or bundled by Vite.

### 2. Backend Architecture (Node.js + Express)
*   **`/backend`**: This directory houses the server-side REST API. It operates independently from the frontend build and is responsible for handling API requests, business logic, and database interactions.
    *   **Tech Stack**: Node.js (ES Modules) with Express.js (`v4.19`).
    *   **Integrations**: Uses `@supabase/supabase-js` for database queries, `razorpay` for payments, and `google-auth-library` for OAuth.
    *   **Security & Middleware**: Configured with `helmet`, `cors`, `express-rate-limit`, `express-validator`, `bcryptjs`, and `jsonwebtoken`.
    *   **Structure (`src/`)**: Organized into `/config`, `/middleware`, and `/routes`, with `server.js` acting as the entry point.
    *   **Environment**: Uses `.env` (refer to `.env.example`) for database URIs, Razorpay keys, and JWT secrets.

### 3. Database Layer (Supabase / PostgreSQL)
*   **`/database`**: This folder contains files related to database architecture and management.
    *   **Provider**: Built on Supabase (PostgreSQL), utilizing the `pgcrypto` extension for UUIDs.
    *   **`schema.sql`**: The single source of truth defining tables, relationships, and seed data.
    *   **Core Tables**: 
        *   `users`, `addresses`: User management and shipping.
        *   `categories`, `products`: Product catalog (prices are stored in paise).
        *   `carts`, `cart_items`, `orders`, `order_items`: E-commerce purchasing flow.
        *   `payments`: Tracks Razorpay transaction states.

## Data Flow
1.  **Client Request**: The user interacts with the React frontend (running from `/src`). Custom interactions might trigger scripts from `/js` and styles from `/css`.
2.  **API Call**: The frontend makes HTTP requests to the backend server.
3.  **Processing**: The `/backend` receives the request, processes the business logic, and prepares a database query if necessary.
4.  **Database Interaction**: The backend executes queries against the database (the structure of which is defined in `/database/schema.sql`).
5.  **Response**: Data is returned from the database to the backend, which then formats a response and sends it back to the frontend to update the UI.
