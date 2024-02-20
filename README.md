# Simple Expense Manager API
Back-End API server for [Simple Expense Manager](https://letitia-chiu.github.io/simple-expense-manager)

## Overview

### Features
- Users can register, login, and logout.
- Users can get income and expense records for each month.
- Users can add, view, edit, and delete individual income or expense records.
- Users can add, view, edit, and delete income or expense categories.
- Users can get monthly financial reports.

### Front-End Repository & Live Site URL
[Front-End Repository](https://github.com/letitia-chiu/simple-expense-manager)
[Live Site URL](https://letitia-chiu.github.io/simple-expense-manager)

## System Architecture
- Serve the application and PostgreSQL database on AWS EC2
- CRUD PostgreSQL database via Sequelize
- Domain name management on AWS Route 53
- Use a domain name and enable HTTPS with Caddy

## Development Tools & Resources
- [Node.js (v20.10.0)](https://nodejs.org/) - Runtime environment
- [Express](https://expressjs.com/) - Node.js web application framework
- [PostgreSQL (v16)](https://www.postgresql.org/) - Database
- [Sequelize](https://sequelize.org/) - ORM
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Salting and hashing passwords
- [JSON Web Tokens](https://www.npmjs.com/package/jsonwebtoken) - User authentication

## Author
[Letitia Chiu](https://github.com/letitia-chiu)
