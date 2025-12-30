# Stake in Nature (SIN)

<div align="center">

![SIN Logo](public/logo-green.png)


[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.19-363636?logo=solidity)](https://soliditylang.org/)
[![BlockDAG](https://img.shields.io/badge/BlockDAG-Testnet-green)](https://awakening.bdagscan.com/)

🌐 **[Live Demo](https://sin.expose.software)**

</div>

---

A **blockchain-based staking and verification platform** where users stake crypto assets on real-world tasks, submit proof via images, and receive rewards based on **AI-powered authenticity and plagiarism validation**. The platform uses **Ethereum testnet**, **Solidity smart contracts**, and a native utility token called **SIN Coin**.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Overview

**Stake in Nature** incentivizes positive real-world actions by introducing *financial accountability*. Users stake funds before performing a task. Successful task validation unlocks rewards, while failure results in locked (non-recoverable) funds—ensuring seriousness and commitment.

Core pillars:

- Trustless execution using smart contracts
- AI-based image validation using Google Gemini API
- Staking & reward mechanism using SIN Coin
- Transparent and decentralized workflow

## System Architecture

- **Frontend**: Web-based dApp (Wallet connection + UI)
- **Backend**: Validation engine
- **Blockchain**: Ethereum Testnet
- **Smart Contracts**: Solidity
- **Token**: Custom ERC-based SIN Coin

## Development Phases

### Tech Stack Used

- **Blockchain**: Ethereum Testnet (for safe experimentation)
- **Smart Contracts**: Solidity
- **Wallet Integration**: MetaMask-compatible wallets
- **Token Standard**: ERC-20 (SIN Coin)
- **Frontend**: Web-based App

Smart Contract Design & Deployment

Key smart contract functionalities:

- Task creation and staking
- Locking staked funds during validation
- Accepting validation scores from backend oracle
- Reward calculation and fund release
- Permanent fund lock on validation failure

Security considerations:

- Reentrancy protection
- Access control (only authorized validator can submit scores)
- Immutable penalty logic

Deployed on **Ethereum Testnet** using Solidity.

### Wallet Creation & Integration

- Enabled users to:
  -- Create or connect crypto wallets
  -- View SIN Coin balance
  -- Stake funds directly from wallet
  -- Claim rewards post validation
- Integrated wallet connection with frontend for seamless UX

### Task Submission Workflow

-- Users select a task
-- Stake SIN Coins
-- Perform the task in real world
-- Upload **image proof** via the platform

The image is securely forwarded to the backend for validation.

### AI-Based Image Validation

- Integrated AI for:
  -- Image authenticity verification
  -- Plagiarism detection
  -- Similarity & manipulation analysis

Validation process:

1. Image is analyzed for originality
2. Cross-checked against known/previous submissions
3. Gemini returns a **validation score**

### Scoring & Decision Logic

- Defined score thresholds:
  -- **Above threshold** → Eligible for rewards
  -- **Below threshold / Failed validation** → Funds permanently locked
- Validation score is sent to the smart contract
- Smart contract executes outcome automatically

### Reward & Penalty Mechanism

**If validation passes:**
- User receives a percentage-based reward
- User can claim:
  - Original stake
  - Earned reward

**If validation fails:**
- Staked SIN Coins are locked forever
- No admin override (fully decentralized penalty)

### End-to-End Testing

- Smart contract testing on Ethereum Testnet
- Wallet transaction validation
- Edge case testing (invalid images, duplicate uploads, low scores)

### Security & Optimization

- Gas optimization in smart contracts
- Removed centralized reward manipulation
- Ensured backend only acts as a *validation oracle*, not fund controller

## Trust & Transparency

- Funds handled **only** by smart contracts
- AI validation ensures fairness
- No manual reward allocation
- All transactions visible on blockchain

## Contributors

Built with passion by the **Stake in Nature** team 

- [Debapriya Mondal](https://github.com/zaxswer)
- [Prithvi Raj Banik](https://github.com/Xolo978)
- [Anurag Deb](https://github.com/anurag-05-cmd)
- [Sangram Keshari Patra](https://github.com/Sangram-Keshari-Patra)
