import { useState } from "react";
import {
  connectWallet,
  approveIssuer,
  issueCertificate,
  verifyCertificate,
} from "./stacks";

function App() {
  const [wallet, setWallet] = useState("");
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const shortAddress = (address) =>
    address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "";

  const handleConnect = async () => {
    const response = await connectWallet();

    const stacksAddress = response?.addresses?.find(
      (item) =>
        item.address?.startsWith("ST") || item.address?.startsWith("SP")
    )?.address;

    if (stacksAddress) {
      setWallet(stacksAddress);
      setMessage("Wallet connected successfully.");
    } else {
      setMessage("Wallet connection was cancelled or unsuccessful.");
    }
  };

  const handleApprove = async () => {
    if (!wallet) {
      setMessage("Connect your wallet first.");
      return;
    }

    try {
      setMessage("Opening wallet to approve issuer...");
      await approveIssuer(wallet);
      setMessage("Approval transaction submitted. If already approved, you can continue issuing certificates.");
    } catch (error) {
      console.error(error);
      setMessage("Approval failed or issuer may already be approved.");
    }
  };

  const handleIssue = async (event) => {
    event.preventDefault();

    if (!wallet) {
      setMessage("Connect your wallet first.");
      return;
    }

    if (!recipient.trim() || !title.trim()) {
      setMessage("Enter recipient wallet and certificate title.");
      return;
    }

    try {
      setMessage("Opening wallet for certificate issue transaction...");
      await issueCertificate(recipient.trim(), title.trim());
      setMessage("Certificate transaction submitted. After confirmation, verify the returned certificate ID.");
    } catch (error) {
      console.error(error);
      setMessage("Issue transaction failed.");
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    const id = certificateId.trim();

    if (!/^\d+$/.test(id) || BigInt(id) < 1n) {
      setCertificate(null);
      setMessage("Enter a valid certificate ID.");
      return;
    }

    setLoading(true);
    setCertificate(null);
    setMessage("");

    try {
      const found = await verifyCertificate(id, wallet || undefined);

      if (!found) {
        setMessage(`Certificate ID ${id} was not found.`);
      } else {
        setCertificate(found);
        setMessage("Certificate verified successfully.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.badge}>Stacks Testnet • Clarity Smart Contract</p>
        <h1 style={styles.title}>Certichain</h1>
        <p style={styles.subtitle}>
          Issue and verify tamper-resistant academic certificates on the blockchain.
        </p>

        <button style={styles.primaryButton} onClick={handleConnect}>
          {wallet ? "Wallet Connected" : "Connect Xverse Wallet"}
        </button>

        {wallet && (
          <p style={styles.wallet}>
            Connected: <strong>{shortAddress(wallet)}</strong>
          </p>
        )}
      </section>

      {message && <div style={styles.message}>{message}</div>}

      <section style={styles.grid}>
        <div style={styles.card}>
          <h2>Issuer Panel</h2>
          <p style={styles.cardText}>
            Approve an issuer, then issue a blockchain-backed certificate.
          </p>

          <button style={styles.secondaryButton} onClick={handleApprove}>
            Approve My Wallet as Issuer
          </button>

          <form onSubmit={handleIssue} style={styles.form}>
            <input
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              placeholder="Recipient ST address"
              style={styles.input}
            />

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Certificate title"
              style={styles.input}
            />

            <button type="submit" style={styles.primaryButton}>
              Issue Certificate
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h2>Public Verification</h2>
          <p style={styles.cardText}>
            Anyone can verify a certificate ID without connecting a wallet.
          </p>

          <form onSubmit={handleVerify} style={styles.form}>
            <input
              value={certificateId}
              onChange={(event) => setCertificateId(event.target.value)}
              placeholder="Enter certificate ID"
              style={styles.input}
            />

            <button type="submit" disabled={loading} style={styles.primaryButton}>
              {loading ? "Verifying..." : "Verify Certificate"}
            </button>
          </form>
        </div>
      </section>

      {certificate && (
        <section style={styles.certificate}>
          <p style={styles.verifiedBadge}>✅ VERIFIED ON-CHAIN</p>
          <h2 style={styles.certTitle}>{certificate.title}</h2>

          <div style={styles.certRow}>
            <span>Recipient</span>
            <strong>{shortAddress(certificate.recipient)}</strong>
          </div>

          <div style={styles.certRow}>
            <span>Issuer</span>
            <strong>{shortAddress(certificate.issuer)}</strong>
          </div>

          <div style={styles.certRow}>
            <span>Issued at block</span>
            <strong>{certificate.issuedAt}</strong>
          </div>

          <div style={styles.certRow}>
            <span>Status</span>
            <strong>{certificate.revoked ? "Revoked" : "Valid"}</strong>
          </div>

          <div style={styles.certRow}>
            <span>Issuer approved</span>
            <strong>{certificate.issuerApproved ? "Yes" : "No"}</strong>
          </div>

          <p style={styles.footerNote}>
            Secured by Certichain smart contract on Stacks Testnet.
          </p>
        </section>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(135deg, #07111f, #102a43)",
    color: "#f8fafc",
  },
  hero: {
    maxWidth: "900px",
    margin: "0 auto 32px",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(56, 189, 248, 0.15)",
    color: "#7dd3fc",
    fontSize: "14px",
  },
  title: {
    fontSize: "56px",
    margin: "18px 0 8px",
  },
  subtitle: {
    fontSize: "20px",
    color: "#cbd5e1",
    maxWidth: "620px",
    margin: "0 auto 24px",
  },
  wallet: {
    color: "#bae6fd",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(15, 23, 42, 0.88)",
    border: "1px solid rgba(148, 163, 184, 0.25)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  },
  cardText: {
    color: "#cbd5e1",
  },
  form: {
    display: "grid",
    gap: "14px",
    marginTop: "18px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f8fafc",
    fontSize: "15px",
  },
  primaryButton: {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#38bdf8",
    color: "#082f49",
    fontWeight: "700",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #38bdf8",
    background: "transparent",
    color: "#7dd3fc",
    fontWeight: "700",
    cursor: "pointer",
  },
  message: {
    maxWidth: "1000px",
    margin: "0 auto 24px",
    padding: "14px 18px",
    borderRadius: "12px",
    background: "rgba(56, 189, 248, 0.12)",
    color: "#e0f2fe",
  },
  certificate: {
    maxWidth: "760px",
    margin: "32px auto 0",
    padding: "32px",
    borderRadius: "24px",
    background: "#f8fafc",
    color: "#0f172a",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  verifiedBadge: {
    color: "#15803d",
    fontWeight: "800",
    letterSpacing: "1px",
  },
  certTitle: {
    fontSize: "32px",
    margin: "10px 0 24px",
  },
  certRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderTop: "1px solid #e2e8f0",
    padding: "14px 0",
  },
  footerNote: {
    marginTop: "24px",
    color: "#475569",
    fontSize: "14px",
  },
};

export default App;
