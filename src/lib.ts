import { ExecException, exec } from "child_process";

type ExecResponse = {
  stdout: string;
  stderr: string | null;
  err: ExecException | null;
};

export function execCmd(cmd: string, cwd?: string): Promise<ExecResponse> {
  let opts = {};
  if (cwd) {
    opts = { cwd };
  }
  return new Promise<ExecResponse>((resolve, _) => {
    exec(cmd, opts, (err, stdout, stderr) => {
      resolve({
        stdout,
        stderr,
        err,
      });
    });
  });
}
