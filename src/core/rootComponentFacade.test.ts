import { describe, expect, it } from "vitest";
import { RootComponentFacade } from "./rootComponentFacade";

describe("RootComponentFacade", () => {
  it("should have the following properties and default values", () => {
    const fn = () => {
      /* NOOP */
    };
    const conf = new RootComponentFacade(fn);
    expect(conf.signalDisposed).to.not.be.null;
    expect(conf.signalDisposed).to.eq(fn);
  });
});
