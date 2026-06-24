import { connect } from "@stacks/connect";
import {
  cvToJSON,
  fetchCallReadOnlyFunction,
  uintCV,
} from "@stacks/transactions";

const CONTRACT_ADDRESS = "ST16E9MWDY1EYY2EKRAH8YV2MK9SQG8D4GFZ68MTC";
const CONTRACT_NAME = "certificates";

export const connectWallet = async () => {
  try {
    return await connect();
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
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
    network: "testnet",
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
