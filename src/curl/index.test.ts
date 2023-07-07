import { describe, expect, it, vi, afterEach } from "vitest";
import { Url } from "./";
import { Log, execCmd } from "../lib";

const mocks = vi.hoisted(() => {
    return {
        execCmd: vi.fn().mockResolvedValue({
            stdout: "stdout",
            stderr: null,
            err: null,
        }),
    };
});

vi.mock("../lib", async () => {
    const actual = (await vi.importActual("../lib")) as Log;
    return {
        ...actual,
        execCmd: mocks.execCmd,
    };
});


const url = "https://google.com";
const dest = "/tmp/foo"

describe("Test curl", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("Download example file", async () => {
        const urlObj = new Url({
            url,
            dest,
            silent: true,
        });
        const res = await urlObj.safeGet();
        expect(res.success).toBeTruthy();
        expect(res.error).toBeNull()
        expect(mocks.execCmd).toHaveBeenCalledOnce()
        expect(mocks.execCmd).toHaveBeenCalledWith(`${process.env.SHELL || "/bin/sh"} -c curl -L -o ${dest} ${url}`);
    })

    it("Download example file with err", async () => {
        mocks.execCmd.mockResolvedValueOnce({
            stdout: null,
            stderr: "stderr",
            err: {
                code: 1,
                message: "error",
            },
        })
        const urlObj = new Url({
            url,
            dest,
            silent: true,
        });
        const res = await urlObj.safeGet();
        expect(res.success).toBeFalsy();
        expect(res.error).not.toBeNull()
        expect(mocks.execCmd).toHaveBeenCalledOnce()
        expect(mocks.execCmd).toHaveBeenCalledWith(`${process.env.SHELL || "/bin/sh"} -c curl -L -o ${dest} ${url}`);
    })
});

