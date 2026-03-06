/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-underscore-dangle */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { RootComponentFacade } from "../../src/index";

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
