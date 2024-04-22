/**
 * @format
 */

import "react-native";
import React from "react";

import { compareVersions } from "../src/utils/generalUtils";

it("compare Versions positive flow", () => {
  const res = compareVersions("1.2.3", "1.1.1");
  expect(res).toBe(true);
});

it("compare Versions negative flow", () => {
  const res = compareVersions("1.2.3", "1.2.4");
  expect(res).toBe(false);
});
// test :))
it("compiling compareVersions without argument", () => {
  expect(() => compareVersions()).toThrow();
});
