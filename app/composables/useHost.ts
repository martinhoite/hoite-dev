export default function useHost() {
  const {
    dev: { localDevelopmentHost }
  } = useRuntimeConfig();

  /**
   * Normalizes a host value to a lowercase hostname without port information.
   */
  const normalizeHostname = (host: string): string => {
    const domain = host.split(':')[0] ?? '';
    return domain.toLowerCase();
  };

  /**
   * Checks if a hostname matches a local host pattern (localhost, loopback, or the provided local dev host/subdomain).
   * This helper is framework-agnostic and safe to use in any context.
   */
  const isLocalHostName = (hostname: string, localDevHost?: string): boolean => {
    const normalizedHost = normalizeHostname(hostname);
    const normalizedLocalHost = normalizeHostname(localDevHost ?? '');

    if (normalizedHost === 'localhost' || normalizedHost === '127.0.0.1') {
      return true;
    }

    if (!normalizedLocalHost) {
      return false;
    }

    return normalizedHost === normalizedLocalHost || normalizedHost.endsWith(`.${normalizedLocalHost}`);
  };

  /**
   * Returns "host:port" for the current request.
   * Uses request headers on the server and window.location on the client.
   */
  const getCurrentHost = (): string => {
    if (import.meta.server) {
      return useRequestHeaders(['host']).host ?? '';
    }

    const dom = useDom();
    return dom?.window?.location.host ?? '';
  };

  const getNormalizedHostname = (): string => normalizeHostname(getCurrentHost());

  /**
   * Checks whether a hostname should be considered local.
   * Handles localhost, loopback, and subdomains of the provided dev host.
   */
  const isLocalhost = (): boolean => {
    return isLocalHostName(getNormalizedHostname(), localDevelopmentHost);
  };

  return {
    getCurrentHost,
    getNormalizedHostname,
    isLocalhost
  };
}
