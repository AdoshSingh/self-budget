class Logger {

  constructor() {}

  info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  }

  error(message: any, method?: string, utility?: string): void {
    const errorMsg = `Error in  ${utility ? utility : ''} -> ${method ? method : ''}`;
    console.error(`[ERROR] ${new Date().toISOString()}: ${errorMsg}`, message);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
  }
}

export default Logger;