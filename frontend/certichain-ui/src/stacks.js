import { AppConfig, UserSession, openLogin } from "@stacks/connect";

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });

export const connectWallet = () => {
  openLogin({
    appDetails: {
      name: "Certichain",
      icon: window.location.origin + "/vite.svg",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
};
