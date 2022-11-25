import { thresholdWeaken } from '/lib/hacking.js';

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.args.length) {
    ns.tprint('No server given, shutting down');

    return;
  }

  ns.disableLog('ALL');
  ns.enableLog('weaken');

  while ((await thresholdWeaken(ns, ns.args[0])) || (await ns.sleep(1))) {}
}
