# <p align="center"><img src="docs/assets/certichain-logo.png" width="180"></p>

# <p align="center">CERTICHAIN</p>

## <p align="center">Secure Academic Credentials. Instant Blockchain Verification.</p>

<p align="center">

A decentralized platform for issuing and verifying tamper-resistant academic credentials on the **Stacks Blockchain**.

</p>

---

# 📖 Overview

Academic certificate fraud remains a significant challenge for educational institutions, employers, and graduates. Traditional verification methods are often slow, manual, and susceptible to document forgery.

**Certichain** solves this problem by enabling trusted institutions to issue blockchain-backed academic credentials that anyone can verify instantly through the Stacks blockchain.

Instead of contacting schools or relying on paper documents, employers and institutions can verify credentials publicly, securely, and transparently.

---

# ✨ Key Features

* 🔐 Secure Xverse Wallet Authentication
* 🏛 Institution Issuer Approval
* 📜 Blockchain Certificate Issuance
* 🛡 Public Certificate Verification
* ⛓ Immutable On-chain Credential Storage
* ⚡ Fast Verification by Certificate ID
* 🎨 Modern Responsive React Interface
* 🌐 Built on Stacks Testnet

---

# 🚀 Live Smart Contract

**Network**

Stacks Testnet

**Contract**

```
ST16E9MWDY1EYY2EKRAH8YV2MK9SQG8D4GFZ68MTC.certificates-v2
```

---

# 🏗 Architecture

```
                Institution

                     │

                     ▼

             React Frontend

                     │

                     ▼

         Stacks Connect + Xverse

                     │

                     ▼

        Clarity Smart Contract

                     │

                     ▼

          Stacks Testnet Blockchain
```

---

# ⚙ Smart Contract Functions

| Function           | Description                           |
| ------------------ | ------------------------------------- |
| approve-issuer     | Approves trusted issuing institutions |
| revoke-issuer      | Removes issuer authorization          |
| issue-certificate  | Issues blockchain credentials         |
| verify-certificate | Verifies credential authenticity      |
| revoke-certificate | Revokes compromised credentials       |
| check-issuer       | Checks issuer authorization           |
| get-cert-count     | Returns total issued credentials      |

---

# 🎯 Demo Workflow

### 1️⃣ Connect Wallet

Authenticate using the Xverse Wallet on Stacks Testnet.

↓

### 2️⃣ Approve Issuer

The administrator authorizes an institution to issue credentials.

↓

### 3️⃣ Issue Credential

Enter the recipient wallet address and credential title.

↓

### 4️⃣ Blockchain Storage

The credential is permanently recorded on-chain.

↓

### 5️⃣ Verify Credential

Anyone can verify the credential instantly using its Certificate ID.

---

# 📸 Screenshots

## 🏠 Home

<p align="center">
  <img src="docs/screenshots/home.png" width="900"/>
</p>

---

## 🔗 Wallet Connected

<p align="center">
  <img src="docs/screenshots/wallet.png" width="900"/>
</p>

---

## 📜 Issue Credential

<p align="center">
  <img src="docs/screenshots/issue.png" width="900"/>
</p>

---

## ✅ Verified Digital Credential

<p align="center">
  <img src="docs/screenshots/verify.png" width="900"/>
</p>

# 💻 Tech Stack

* Clarity
* Stacks Blockchain
* Clarinet
* React
* Vite
* JavaScript
* Stacks.js
* Xverse Wallet
* GitHub Codespaces

---

# 📂 Project Structure

```
Certichain/

├── contracts/
│   ├── certificates.clar
│   └── certificates-v2.clar
│
├── frontend/
│   └── certichain-ui/
│
├── tests/
│
├── deployments/
│
├── docs/
│   ├── assets/
│   │   └── certichain-logo.png
│   │
│   └── screenshots/
│
└── README.md
```

---

# ▶ Running Locally

### Smart Contract

```bash
clarinet check

npm test
```

### Frontend

```bash
cd frontend/certichain-ui

npm install

npm run dev
```

---

# 🌍 Why Stacks?

Stacks enables secure smart contracts anchored to Bitcoin while supporting expressive smart contract development through Clarity.

Certichain leverages these capabilities to provide a trustworthy platform for issuing and verifying academic credentials with transparency and permanence.

---

# 🔮 Future Roadmap

* 📱 QR Code Verification
* 🏫 Institution Dashboard
* 🌍 Public Verification Portal
* 📄 PDF Credential Export
* 🔔 Verification Notifications
* 🌐 Mainnet Deployment
* 🪪 NFT-backed Credentials
* 🏢 Multi-Institution Support

---

# 👨‍💻 Author

**Olatunde Olagoke**

Built with passion for secure, transparent, and verifiable academic credentials using the Stacks Blockchain.

---

# ⭐ If you found this project interesting, please consider giving it a star.
