const MAX_MONEY_THRESHOLD = 0.9;
const MIN_SECURITY_THRESHOLD = 1.1;

/** @param {NS} ns */
export async function thresholdWeaken(ns, server) {
  if (securityWithinThreshold(ns, server)) {
    return false;
  }

  await ns.weaken(server);

  return true;
}

export async function maxWeaken(ns, server) {
  if (securityAtMinimum(ns, server)) {
    return false;
  }

  await ns.weaken(server);

  return true;
}

/** @param {NS} ns */
export async function thresholdGrow(ns, server) {
  if (moneyWithinThreshold(ns, server)) {
    return false;
  }

  await ns.grow(server);

  return true;
}

export async function maxGrow(ns, server) {
  if (moneyAtMaximum(ns, server)) {
    return false;
  }

  await ns.grow(server);

  return true;
}

/** @param {NS} ns */
export function securityWithinThreshold(ns, server) {
  return (
    ns.getServerSecurityLevel(server) <
    ns.getServerMinSecurityLevel(server) * MIN_SECURITY_THRESHOLD
  );
}

/** @param {NS} ns */
export function securityAtMinimum(ns, server) {
  return ns.getServerSecurityLevel(server) === ns.getServerMinSecurityLevel(server);
}

/** @param {NS} ns */
export function moneyWithinThreshold(ns, server) {
  return ns.getServerMoneyAvailable(server) > ns.getServerMaxMoney(server) * MAX_MONEY_THRESHOLD;
}

/** @param {NS} ns */
export function moneyAtMaximum(ns, server) {
  return ns.getServerMoneyAvailable(server) === ns.getServerMaxMoney(server);
}
