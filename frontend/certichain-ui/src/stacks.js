import { connect } from "@stacks/connect";

export const connectWallet = async () => {
try {
const response = await connect();

```
console.log("Wallet connected:", response);

return response;
```

} catch (error) {
console.error("Wallet connection failed:", error);
return null;
}
};
