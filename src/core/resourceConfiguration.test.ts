import { describe, expect, it } from "vitest";
import { ResourceConfiguration } from "./resourceConfiguration";

describe("ResourceConfiguration", () => {
  it("should have the following properties and default values", () => {
    const conf = new ResourceConfiguration();
    expect(conf.url).to.eq("");
    expect(conf.attributes).to.be.undefined;
    expect(conf.isScript).to.eq(true);
    expect(conf.skip()).to.eq(false);
  });
});
