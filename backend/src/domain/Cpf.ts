import assert from "assert";

export class Cpf {
  value: string;

  constructor(cpf: string | undefined | null) {
    this.value = cpf as string;
    if (!this.validate()) throw new Error("Invalid CPF");
  }

  private validate() {
    if (!this.value) return false;
    this.value = this.clean();
    if (this.isInvalidLength()) return false;
    if (this.allDigitsAreTheSame()) return false;
    const dg1 = this.calculateDigit(10);
    const dg2 = this.calculateDigit(11);
    return this.extractCheckDigit() === `${dg1}${dg2}`;
  }
  private clean() {
    assert(this.value);
    return this.value.replace(/\D/g, "");
  }

  private isInvalidLength() {
    assert(this.value);
    return this.value.length !== 11;
  }

  private allDigitsAreTheSame() {
    assert(this.value);
    return this.value.split("").every((c) => c === (this.value as string)[0]);
  }

  private calculateDigit(factor: number) {
    assert(this.value);
    let total = 0;
    for (const digit of this.value) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  private extractCheckDigit() {
    assert(this.value);
    return this.value.slice(9);
  }
}
