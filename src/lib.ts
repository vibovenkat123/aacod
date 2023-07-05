import { ExecException, exec } from "child_process";

type ExecResponse = {
  stdout: string;
  stderr: string | null;
  err: ExecException | null;
};

export function execCmd(cmd: string): Promise<ExecResponse> {
  return new Promise<ExecResponse>((resolve, _) => {
    exec(cmd, (err, stdout, stderr) => {
      resolve({
        stdout,
        stderr,
        err,
      });
    });
  });
}
