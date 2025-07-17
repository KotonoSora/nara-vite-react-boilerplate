import { describe, expect, test } from "vitest";

import { USER_GROUPS } from "../types";

describe("Feature Flag Types", () => {
  test("USER_GROUPS should contain expected rollout phases", () => {
    expect(USER_GROUPS.INTERNAL).toBe("internal");
    expect(USER_GROUPS.BETA_1).toBe("beta_1");
    expect(USER_GROUPS.BETA_2).toBe("beta_2");
    expect(USER_GROUPS.BETA_3).toBe("beta_3");
    expect(USER_GROUPS.PRODUCTION).toBe("production");
    expect(USER_GROUPS.WHITE_LABEL_PARTNERS).toBe("white_label_partners");
    expect(USER_GROUPS.LARGE_DATA_CUSTOMERS).toBe("large_data_customers");
    expect(USER_GROUPS.HIGH_TIER_USERS).toBe("high_tier_users");
  });

  test("USER_GROUPS should have all unique values", () => {
    const values = Object.values(USER_GROUPS);
    const uniqueValues = [...new Set(values)];
    expect(values.length).toBe(uniqueValues.length);
  });
});