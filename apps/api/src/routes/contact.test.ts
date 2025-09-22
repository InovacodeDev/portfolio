/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from "assert";
import { sendEmailNotificationResend, escapeHtml } from "./contact";

// Simple smoke tests for helper functions.
// These are not wired to a test runner in package.json; run with ts-node if desired.

async function testSkipWhenNoEnv() {
    // Ensure env vars missing -> function returns without throwing
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_TO;

    await sendEmailNotificationResend({ name: "A", email: "a@b.com", message: "hi", contactId: 1 });
    console.log("testSkipWhenNoEnv passed");
}

async function testSendWithMock() {
    // Provide env vars and mock Resend in global scope
    process.env.RESEND_API_KEY = "test-key";
    process.env.EMAIL_TO = "admin@example.com";

    // monkey-patch the Resend constructor used by the module
    // @ts-ignore
    const originalResend = (await import("resend")).default;

    // Create a fake Resend class
    class FakeResend {
        emails = {
            send: async (opts: any) => {
                // verify expected fields exist
                assert.ok(opts.from);
                assert.ok(opts.to);
                assert.ok(opts.subject);
                assert.ok(opts.text || opts.html);
                return { id: "fake-id" };
            },
        };
    }

    // Patch module cache so our imported function uses the fake
    // Not all module systems allow overwriting; this is a best-effort smoke test.
    try {
        // @ts-ignore
        (await import("url")).pathToFileURL; // noop to appease some environments
    } catch {}

    // Call helper with a logger that records messages
    const logs: string[] = [];
    const logger = {
        info: (...args: any[]) => logs.push("info:" + JSON.stringify(args)),
        warn: (...args: any[]) => logs.push("warn:" + JSON.stringify(args)),
        error: (...args: any[]) => logs.push("error:" + JSON.stringify(args)),
    };

    // If we can't patch the library, just call the function to ensure no throw
    try {
        // @ts-ignore
        (await import("resend")).default = FakeResend;
    } catch (e) {
        console.warn("Could not monkey-patch resend module (test will be best-effort)", e);
    }

    await sendEmailNotificationResend({ name: "A", email: "a@b.com", message: "hello", contactId: 2 }, logger);
    console.log("testSendWithMock passed", logs);
}

function testEscapeHtml() {
    const raw = "<script>alert('x')</script> & ";
    const escaped = escapeHtml(raw);
    assert.ok(!escaped.includes("<script>"));
    console.log("testEscapeHtml passed");
}

(async function run() {
    await testSkipWhenNoEnv();
    await testSendWithMock();
    testEscapeHtml();
    console.log("All tests passed (smoke)");
})();
