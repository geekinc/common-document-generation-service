import { dao } from "../../lib/dao-mysql-lib.cjs";

test('dao-lib - simple SQL tests', async () => {
    let result = await dao.run("SHOW GLOBAL STATUS LIKE 'Uptime'");

    // Check the response for the expected error
    expect(Number(result[0]['Value'])).toBeGreaterThan(0);
});
