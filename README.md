

# Sales Call Performance Dashboard

A Laravel-based dashboard to analyze and visualize sales call performance with features like file uploads, agent-wise statistics, and paginated reports.

## Features
📂 Upload call performance data files

📑 Paginated performance reports

👨‍💼 Agent-wise statistics and KPIs

📊 Visual representation of call activity

⚡ Real-time asset compilation with Vite


🛠️ Tech Stack
Backend: Laravel (PHP)

Frontend: React, Vite,JavaScript, CSS

Database: MySQL 

📦 Installation
Clone the Repository
git clone https://github.com/your-username/Sales-call-performance-dashboard.git
cd Sales-call-performance-dashboard

Install Backend Dependencies
composer install

Install Frontend Dependencies
npm install

Configure Environment
cp .env.example .env
php artisan key:generate
(Update .env file with correct database credentials)

Migrate the Database
php artisan migrate

Run the Project
Start Laravel Backend: php artisan serve
Start Vite for Frontend Assets: npm run dev



📂 Project Structure
SalesCallPerformanceDashboard/
├── app/ # Laravel backend logic
├── database/ # Migrations & seeders
├── public/ # Public assets
├── resources/ # Views, JS, CSS
├── routes/ # Web & API routes
├── package.json # Frontend dependencies
├── composer.json # Backend dependencies
└── .env.example # Environment example file





