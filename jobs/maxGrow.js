import { maxGrow } from '/lib/hacking.js';

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.args.length) {
    ns.tprint('No server given, shutting down');

    return;
  }

  ns.disableLog('ALL');
  ns.enableLog('grow');

  while (await maxGrow(ns, ns.args[0])) {}
}
