import { connect } from "@stacks/connect";

export const connectWallet = async () => {
  try {
    const response = await connect();

    console.log("FULL RESPONSE");
    console.log(response);

    return response;
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
};
