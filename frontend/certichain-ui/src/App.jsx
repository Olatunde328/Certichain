import { useState } from "react";
import { connectWallet, verifyCertificate } from "./stacks";

function App() {
  const [wallet, setWallet] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    const response = await connectWallet();

    const stacksAddress = response?.addresses?.find(
      (item) =>
        item.address?.startsWith("ST") || item.address?.startsWith("SP")
    )?.address;

    if (stacksAddress) {
      setWallet(stacksAddress);
      setMessage("");
    } else {
      setMessage("Wallet connection was cancelled or unsuccessful.");
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
      }
    } catch (error) {
      console.error(error);
      setMessage("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "720px" }}>
      <h1>Certichain MVP</h1>
      <p>Blockchain Certificate Issuance & Verification System</p>

      <hr />

      <button onClick={handleConnect}>Connect Wallet</button>

      {wallet && (
        <p>
          <strong>Connected Wallet:</strong> {wallet}
        </p>
      )}

      <h3>Verify Certificate</h3>

      <form onSubmit={handleVerify}>
        <input
          value={certificateId}
          onChange={(event) => setCertificateId(event.target.value)}
          placeholder="Enter certificate ID"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {message && <p>{message}</p>}

      {certificate && (
        <div style={{ marginTop: "24px" }}>
          <h3>Certificate Found</h3>
          <p><strong>Title:</strong> {certificate.title}</p>
          <p><strong>Recipient:</strong> {certificate.recipient}</p>
          <p><strong>Issuer:</strong> {certificate.issuer}</p>
          <p><strong>Issued at block:</strong> {certificate.issuedAt}</p>
          <p><strong>Revoked:</strong> {certificate.revoked ? "Yes" : "No"}</p>
          <p>
            <strong>Issuer approved:</strong>{" "}
            {certificate.issuerApproved ? "Yes" : "No"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
