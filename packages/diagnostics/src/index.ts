type WarnInDevelopmentOptions = {
  key?: string;
};

type RuntimeProcess = {
  env?: {
    NODE_ENV?: string;
  };
};

const warnedKeys = new Set<string>();

function getNodeEnvironment(): string | undefined {
  const maybeGlobal = globalThis as { process?: RuntimeProcess };

  return maybeGlobal.process?.env?.NODE_ENV;
}

function isExplicitDevelopmentEnvironment(): boolean {
  return getNodeEnvironment() === 'development';
}

export function warnInDevelopment(message: string, options?: WarnInDevelopmentOptions): void {
  if (!isExplicitDevelopmentEnvironment()) {
    return;
  }

  const key = options?.key;

  if (key !== undefined) {
    if (warnedKeys.has(key)) {
      return;
    }

    warnedKeys.add(key);
  }

  console.warn(message);
}
