# DonatChain – Smart Blockchain & AI-Based Donation Platform

DonatChain is a modern donation management platform that integrates **Blockchain**, **Artificial Intelligence**, and **Full-Stack Web technologies** to provide a **transparent, secure, and reliable fundraising solution** for non-profit organizations.  
The platform supports both **cryptocurrency donations** and **credit-card payments**, while ensuring full transparency for all transactions.

---

## Project Goals
- Ensure **full transparency** in the donation process.
- Increase **donor trust** using blockchain technology.
- Allow donations for both **crypto and non-crypto users**.
- Provide a **smart AI-powered search engine** for campaigns and NGOs.
- Offer efficient management tools for NGOs and system administrators.

---

## System Actors
- **Donor** – Browses campaigns, donates via crypto or credit card, receives receipts.
- **NGO** – Creates and manages campaigns, tracks donations.
- **System Administrator** – Approves NGOs and supervises system activity.

---

## System Architecture (High-Level)
The system is built from four main layers:

- **Frontend** – User interface for donors, NGOs, and administrators.
- **Backend** – Manages business logic, users, campaigns, donations, emails, and APIs.
- **Database** – Stores all system data, including NGOs, campaigns, and donations.
- **Blockchain Layer** – Handles on-chain donation records and smart contract logic.

---

## Blockchain & Smart Contracts
- Smart contracts written in **Solidity**.
- Deployed on the **Ethereum Sepolia Testnet**.
- Responsible for:
  - Campaign management.
  - Crypto donation execution.
  - Public recording of credit-card donations for transparency.
- All transactions are publicly verifiable via **Etherscan**.

---

## AI-Powered Search & Recommendation
- Semantic search engine based on **Natural Language Processing (NLP)**.
- Matches campaigns and NGOs based on descriptions, categories, and keywords.
- Improves accessibility and relevance for donors.

---

## 🖥 Core Technologies
### Frontend
- React
- TypeScript
- TailwindCSS
- CSS Modules
- Framer Motion

### Backend
- Node.js
- Express
- MongoDB
- Nodemailer
- Puppeteer
- node-cron

### Blockchain
- Solidity
- Hardhat
- Ethers.js
- Ethereum Sepolia
- Etherscan

### AI
- Sentence Transformers
- Vector Search
- Semantic Similarity Models

---

## Automated Receipts & Emails
- After each donation:
  - A **PDF receipt is generated**.
  - The receipt is sent to the donor via email.
  - The donation is stored both in the database and on the blockchain.

---

## Transparency & Trust
- All crypto donations are recorded on-chain.
- Credit-card donations are publicly logged.
- Every transaction can be independently verified on **Etherscan**.
- Donors receive transaction confirmations and proof of donation.
