import { connect, openContractCall } from "@stacks/connect";
import {
  cvToJSON,
  fetchCallReadOnlyFunction,
  principalCV,
  stringAsciiCV,
  uintCV,
} from "@stacks/transactions";

const CONTRACT_ADDRESS = "SP16E9MWDY1EYY2EKRAH8YV2MK9SQG8D4GFXKRGJN";
const CONTRACT_NAME = "certificates-v2";

export const connectWallet = async () => {
  try {
    return await connect();
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
};

export const issueCertificate = async (recipient, title) => {
  try {
    alert("Opening Xverse to issue certificate...");

    return await openContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "issue-certificate",
      functionArgs: [principalCV(recipient), stringAsciiCV(title)],
      network: "mainnet",
      appDetails: {
        name: "Certichain",
        icon: window.location.origin + "/vite.svg",
      },
      onFinish: (data) => {
        console.log("Issue certificate transaction:", data);
        alert(`Certificate issue transaction submitted: ${data.txId}`);
      },
      onCancel: () => {
        alert("Transaction cancelled.");
      },
    });
  } catch (error) {
    console.error("Issue certificate error:", error);
    alert(`Issue certificate error: ${error.message || error}`);
    throw error;
  }
};

export const approveIssuer = async (issuer) => {
  return await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "approve-issuer",
    functionArgs: [principalCV(issuer)],
    network: "mainnet",
    appDetails: {
      name: "Certichain",
      icon: window.location.origin + "/vite.svg",
    },
    onFinish: (data) => {
      console.log("Approve issuer transaction:", data);
      alert(`Approve issuer transaction submitted: ${data.txId}`);
    },
    onCancel: () => {
      alert("Transaction cancelled.");
    },
  });
};

export const verifyCertificate = async (
  certificateId,
  senderAddress = CONTRACT_ADDRESS
) => {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "verify-certificate",
    functionArgs: [uintCV(BigInt(certificateId))],
    senderAddress,
    network: "mainnet",
  });

  const decoded = cvToJSON(result);

  if (!decoded.success) {
    if (decoded.value?.value === "105") {
      return null;
    }

    throw new Error(`Contract error u${decoded.value?.value || "unknown"}`);
  }

  const certificate = decoded.value.value;

  return {
    issuer: certificate.issuer.value,
    recipient: certificate.recipient.value,
    title: certificate.title.value,
    issuedAt: certificate["issued-at"].value,
    revoked: certificate.revoked.value,
    issuerApproved: certificate["issuer-still-approved"].value,
  };
};
