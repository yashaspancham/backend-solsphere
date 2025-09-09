# Client Utility Express Backend

This is the **backend server** for Solsphere client utility.  
It is built with **Express.js** and uses **SQLite** as the database.

## Features
- Stores system reports sent from clients  
- Provides endpoints to fetch:
  - All reports  
  - Latest report per machine  
  - Distinct OS types  
  - Machines by OS type  
  - History of reports per machine  
- Simple token-based authentication via middleware  

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)  
- npm
- SQLite3  

> Install them if you don’t have them already.

### Installation
1. **Clone the repository**  
```bash
git clone https://github.com/yashaspancham/backend-solsphere.git
```
2.***Enter project folder***
```bash
cd backend-solsphere
```
3.***Install dependencies***
```bash
npm install
```
4.***Start server***
```bash
node server.js
```
5.***with nodemon***
```bash
npm i -g nodemon  #if not installed globally
npx nodemon server
```
