/** @param {NS} ns */
export async function main(ns) {
  if (!ns.args.length) {
    ns.tprint('No server given, shutting down');

    return;
  }

  ns.disableLog('ALL');
  ns.enableLog('grow');

  const server = ns.args[0];

  while ((await ns.grow(server)) || (await ns.sleep(1))) {}
}
