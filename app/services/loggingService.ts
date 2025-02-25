export class LoggingService {
  private environment: string;

  constructor(environment: string) {
    this.environment = environment;
  }

  private createLogger(level: 'log' | 'warn' | 'error' | 'info') {
    return (message: unknown, devOnly: boolean = false, ...optionalParams: unknown[]) => {
      if (!devOnly || this.environment !== 'production') {
        const styles = {
          log: 'color: #42a5f5; font-weight: bold;', // Blue
          info: 'color: cyan; font-weight: bold;', // Cyan
          warn: 'color: orange; font-weight: bold;', // Orange
          error: 'color: red; font-weight: bold;' // Red
        };

        // eslint-disable-next-line no-console
        console[level](`%c${message}`, styles[level], ...optionalParams);
      }
    };
  }

  log = this.createLogger('log');
  info = this.createLogger('info');
  warn = this.createLogger('warn');
  error = this.createLogger('error');
}
