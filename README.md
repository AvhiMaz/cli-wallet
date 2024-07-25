# CLI Wallet

This is a simple CLI wallet for the Solana blockchain, built with Node.js. It allows you to generate a keypair, request an airdrop of SOL, and send SOL to another wallet.

## Prerequisites

- Node.js
- bun

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/solana-cli-wallet.git
    cd cli-wallet
    ```

2. Install dependencies:

    ```bash
    bun install
    ```

## Usage

### Generate a New Keypair

To generate a new keypair and save it to `keypair.json`:

```bash
bun index.ts generate
```

### Request an Airdrop of 1 SOL

```bash
bun index.ts airdrop
```

### Send SOL to Another Wallet

```bash
bun index.ts send -r <recipient-public-key> -a <amount-in-SOL>

```
