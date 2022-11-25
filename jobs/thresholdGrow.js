import { thresholdGrow } from '/lib/hacking.js';

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.args.length) {
    ns.tprint('No server given, shutting down');

    return;
  }

  ns.disableLog('ALL');
  ns.enableLog('grow');
  ns.enableLog('hack');

  const server = ns.args[0];

  while ((await thresholdGrow(ns, server)) || (await ns.hack(server)) || (await ns.sleep(1))) {}
}
