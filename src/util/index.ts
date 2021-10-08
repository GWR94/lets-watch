// amplify
// helper methods for setting up aws_exports with localhost and production simultaneously
export const hasLocalhost = (hostname: string): boolean =>
  Boolean(
    hostname.match(/localhost/) ||
      hostname.match(/127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/),
  );

export const hasHostname = (hostname: string): boolean =>
  Boolean(hostname.includes(window.location.hostname));

export const isLocalhost = hasLocalhost(window.location.hostname);
