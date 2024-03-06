import sinon from "sinon";

sinon.stub(process, "env").value({
  ACCOUNT_PORT: 3001,
  RIDE_PORT: 3002,
  PAYMENT_PORT: 3003,
});
