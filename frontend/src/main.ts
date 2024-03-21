import { createApp } from "vue";
import App from "./App.vue";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import AccountGatewayHttp from "./infra/gateway/AccountGatewayHttp";

const app = createApp(App);
const httpClient = new AxiosAdapter();
const accountGateway = new AccountGatewayHttp(httpClient);
app.provide("accountGateway", accountGateway);
app.mount("#app");
