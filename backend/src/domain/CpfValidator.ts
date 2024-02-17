import assert from "assert";

export class CpfValidator {
  constructor(private cpf: string | undefined | null) {}

  validate() {
    if (!this.cpf) return false;
    this.cpf = this.clean();
    if (this.isInvalidLength()) return false;
    if (this.allDigitsAreTheSame()) return false;
    const dg1 = this.calculateDigit(10);
    const dg2 = this.calculateDigit(11);
    return this.extractCheckDigit() === `${dg1}${dg2}`;
  }
  private clean() {
    assert(this.cpf);
    return this.cpf.replace(/\D/g, "");
  }

  private isInvalidLength() {
    assert(this.cpf);
    return this.cpf.length !== 11;
  }

  private allDigitsAreTheSame() {
    assert(this.cpf);
    return this.cpf.split("").every((c) => c === (this.cpf as string)[0]);
  }

  private calculateDigit(factor: number) {
    assert(this.cpf);
    let total = 0;
    for (const digit of this.cpf) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  private extractCheckDigit() {
    assert(this.cpf);
    return this.cpf.slice(9);
  }
}
