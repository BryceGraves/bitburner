import { maxWeaken } from '/lib/hacking.js';

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.args.length) {
    ns.tprint('No server given, shutting down');

    return;
  }

  ns.disableLog('ALL');
  ns.enableLog('weaken');

  while (await maxWeaken(ns, ns.args[0])) {}
}
