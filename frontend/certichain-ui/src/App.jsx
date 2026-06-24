import { useState } from "react";
import { connectWallet } from "./stacks";

function App() {
  const [wallet, setWallet] = useState("");

  const handleConnect = async () => {
    const response = await connectWallet();

    const stacksAddress = response?.addresses?.find(
      (item) => item.address?.startsWith("ST") || item.address?.startsWith("SP")
    )?.address;

    setWallet(stacksAddress || "Connected");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Certichain MVP</h1>
      <p>Blockchain Certificate Issuance & Verification System</p>

      <hr />

      <button onClick={handleConnect}>
        Connect Wallet
      </button>

      {wallet && (
        <p>
          <strong>Connected Wallet:</strong> {wallet}
        </p>
      )}

      <h3>Verify Certificate</h3>
      <input placeholder="Enter certificate ID" />
      <button>Verify</button>
    </div>
  );
}

export default App;
