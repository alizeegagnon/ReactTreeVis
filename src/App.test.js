const isInDesiredForm = require("./isInDesiredForm");

test("Le string 23 est accepté", () => {
  expect(isInDesiredForm("23").toBe(true));
});
