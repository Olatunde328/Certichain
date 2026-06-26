# Certichain

Certichain is a decentralized certificate issuance and verification platform built on the Stacks blockchain. It allows approved issuers to create tamper-resistant academic certificates and allows anyone to verify certificate authenticity publicly on-chain.

## Problem

Fake academic certificates are a serious problem for schools, employers, and graduates. Traditional certificate verification is often slow, manual, and dependent on contacting institutions directly.

## Solution

Certichain stores certificate records on-chain so that verification becomes public, fast, and tamper-resistant. Each certificate is issued by an approved wallet and can be verified using a certificate ID.

## Live Testnet Contract

`ST16E9MWDY1EYY2EKRAH8YV2MK9SQG8D4GFZ68MTC.certificates-v2`

## Key Features

- Connect Xverse wallet
- Approve issuer wallet
- Issue blockchain-backed certificates
- Verify certificate by ID
- Display certificate title, issuer, recipient, status, and block height
- Public verification without wallet connection
- Built with Clarity smart contracts and React

## Tech Stack

- Clarity
- Clarinet
- Stacks Testnet
- React
- Vite
- Xverse Wallet
- Stacks.js

## Smart Contract Functions

### approve-issuer
Allows the admin wallet to approve trusted certificate issuers.

### issue-certificate
Allows approved issuers to issue certificates to recipients.

### verify-certificate
Allows anyone to verify a certificate by ID.

### revoke-certificate
Allows the admin to revoke a certificate if needed.

## Demo Flow

1. Connect Xverse wallet on Stacks Testnet.
2. Approve wallet as issuer.
3. Enter recipient wallet address and certificate title.
4. Issue certificate.
5. Confirm transaction on Stacks Testnet.
6. Use the returned certificate ID to verify the certificate.
7. View certificate details and verification status.

## Example Certificate

Certificate ID: `2`

Title: `Bachelor of Computer Engineering`

Issuer: `ST16E9MWDY1EYY2EKRAH8YV2MK9SQG8D4GFZ68MTC`

Recipient: `ST16E9MWDY1EYY2EKRAH8YV2MK9SQG8D4GFZ68MTC`

## Project Status

- Smart contract deployed on Stacks Testnet
- Frontend connected to Xverse wallet
- Certificate issuance working
- Certificate verification working
- End-to-end demo completed

## Future Improvements

- Institution dashboard
- QR code verification
- Certificate PDF export
- Mainnet deployment
- Multi-institution issuer management
- Public verification links
- NFT-backed certificates

## Author

Built by Olatunde Olagoke.
