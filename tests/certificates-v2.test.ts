import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

declare const simnet: any;

const accounts = simnet.getAccounts();

describe("Certichain", () => {
  it("ensures simnet is initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("admin approves an issuer", () => {
    const admin = accounts.get("deployer")!;
    const issuer = accounts.get("wallet_1")!;

    const result = simnet.callPublicFn(
      "certificates-v2",
      "approve-issuer",
      [Cl.principal(issuer)],
      admin
    );

    expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
  });

  it("non-admin cannot approve an issuer", () => {
    const nonAdmin = accounts.get("wallet_2")!;
    const issuer = accounts.get("wallet_3")!;

    const result = simnet.callPublicFn(
      "certificates-v2",
      "approve-issuer",
      [Cl.principal(issuer)],
      nonAdmin
    );

    expect(result.result).toEqual(Cl.error(Cl.uint(100)));
  });

  it("approved issuer can issue a certificate with title", () => {
    const admin = accounts.get("deployer")!;
    const issuer = accounts.get("wallet_1")!;
    const recipient = accounts.get("wallet_2")!;

    simnet.callPublicFn(
      "certificates-v2",
      "approve-issuer",
      [Cl.principal(issuer)],
      admin
    );

    const result = simnet.callPublicFn(
      "certificates-v2",
      "issue-certificate",
      [Cl.principal(recipient), Cl.stringAscii("BSc Computer Science")],
      issuer
    );

    expect(result.result).toEqual(Cl.ok(Cl.uint(1)));
  });

  it("unapproved issuer cannot issue a certificate", () => {
    const fakeIssuer = accounts.get("wallet_4")!;
    const recipient = accounts.get("wallet_2")!;

    const result = simnet.callPublicFn(
      "certificates-v2",
      "issue-certificate",
      [Cl.principal(recipient), Cl.stringAscii("Fake Certificate")],
      fakeIssuer
    );

    expect(result.result).toEqual(Cl.error(Cl.uint(103)));
  });

  it("anyone can verify a certificate", () => {
    const admin = accounts.get("deployer")!;
    const issuer = accounts.get("wallet_1")!;
    const recipient = accounts.get("wallet_2")!;
    const stranger = accounts.get("wallet_5")!;

    simnet.callPublicFn(
      "certificates-v2",
      "approve-issuer",
      [Cl.principal(issuer)],
      admin
    );

    simnet.callPublicFn(
      "certificates-v2",
      "issue-certificate",
      [Cl.principal(recipient), Cl.stringAscii("BSc Computer Science")],
      issuer
    );

    const result = simnet.callReadOnlyFn(
      "certificates-v2",
      "verify-certificate",
      [Cl.uint(1)],
      stranger
    );

    expect(result.result.type).toBe("ok");
  });

  it("verify returns correct title", () => {
    const admin = accounts.get("deployer")!;
    const issuer = accounts.get("wallet_1")!;
    const recipient = accounts.get("wallet_2")!;

    simnet.callPublicFn(
      "certificates-v2",
      "approve-issuer",
      [Cl.principal(issuer)],
      admin
    );

    simnet.callPublicFn(
      "certificates-v2",
      "issue-certificate",
      [Cl.principal(recipient), Cl.stringAscii("BSc Computer Science")],
      issuer
    );

    const result = simnet.callReadOnlyFn(
      "certificates-v2",
      "verify-certificate",
      [Cl.uint(1)],
      recipient
    );

    expect(result.result.type).toBe("ok");
    expect(result.result.value.value.title).toEqual(

      Cl.stringAscii("BSc Computer Science")
    );
  });

  it("admin can revoke an issuer", () => {
    const admin = accounts.get("deployer")!;
    const issuer = accounts.get("wallet_1")!;

    simnet.callPublicFn(
      "certificates-v2",
      "approve-issuer",
      [Cl.principal(issuer)],
      admin
    );

    const result = simnet.callPublicFn(
      "certificates-v2",
      "revoke-issuer",
      [Cl.principal(issuer)],
      admin
    );

    expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
  });

  it("admin can revoke a certificate", () => {
    const admin = accounts.get("deployer")!;
    const issuer = accounts.get("wallet_1")!;
    const recipient = accounts.get("wallet_2")!;

    simnet.callPublicFn(
      "certificates-v2",
      "approve-issuer",
      [Cl.principal(issuer)],
      admin
    );

    simnet.callPublicFn(
      "certificates-v2",
      "issue-certificate",
      [Cl.principal(recipient), Cl.stringAscii("BSc Computer Science")],
      issuer
    );

    const result = simnet.callPublicFn(
      "certificates-v2",
      "revoke-certificate",
      [Cl.uint(1)],
      admin
    );

    expect(result.result).toEqual(Cl.ok(Cl.bool(true)));
  });

  it("verifying nonexistent certificate returns error", () => {
    const stranger = accounts.get("wallet_5")!;

    const result = simnet.callReadOnlyFn(
      "certificates-v2",
      "verify-certificate",
      [Cl.uint(999)],
      stranger
    );

    expect(result.result).toEqual(Cl.error(Cl.uint(105)));
  });
});
