import { Cpf } from "../src/domain/Cpf";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Deve testar cpfs válidos",
  function (input: string) {
    const cpf = new Cpf(input);
    expect(cpf.value).toBeDefined();
  }
);

test.each(["", undefined, null, "11111111111", "111", "11111111111111"])(
  "Deve testar cpfs inválidos",
  function (input: string | undefined | null) {
    expect(() => new Cpf(input)).toThrow(new Error("Invalid CPF"));
  }
);
