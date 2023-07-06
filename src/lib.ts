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

export class Log {
  public static info(msg: string): void {
    console.log(`[INFO] ${msg}`);
  }
  public static fatal(msg: string): void {
    console.error(`[FATAL] ${msg}`);
  }
  public static error(msg: string): void {
    console.error(`[ERROR] ${msg}`);
  }
  public static warn(msg: string): void {
    console.warn(`[WARN] ${msg}`);
  }
  public static debug<T>(msg: T): void {
    console.debug(`[DEBUG] ${msg}`);
  }
  public static trace<T>(msg: T): void {
    console.trace(`[TRACE] ${msg}`);
  }
}
