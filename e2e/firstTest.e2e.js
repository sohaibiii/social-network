const TIMEOUT = 250000;

describe("Safarway Login Test", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should have Home screen", async () => {
    await waitFor(element(by.id("homepageFlatListID")))
      .toBeVisible()
      .withTimeout(TIMEOUT);
  });

  it("should show Login screen after tap", async () => {
    await waitFor(element(by.id("homepageFlatListID")))
      .toBeVisible()
      .withTimeout(TIMEOUT);

    await waitFor(element(by.id("ProfileTabID"))).toBeVisible();
    await element(by.id("ProfileTabID")).tap();
  });
  // test1
  it("log in through username/password ", async () => {
    await waitFor(element(by.id("homepageFlatListID")))
      .toBeVisible()
      .withTimeout(TIMEOUT);

    await waitFor(element(by.id("ProfileTabID"))).toBeVisible();

    await element(by.id("ProfileTabID")).tap();

    await element(by.id("loginByEmailPageID")).tap();

    await waitFor(element(by.id("emailFieldID")))
      .toBeVisible()
      .withTimeout(TIMEOUT);
    await element(by.id("emailFieldID")).typeText("safarway.user@gmail.com");
    await element(by.id("passwordFieldID")).typeText("Abcd_1234");
    await element(by.id("loginBtnID")).tap();
  });
});
