/** @param {NS} ns */
export async function main(ns) {
  const options = ns.flags([['threaded', false]]);

  ns.tprint(options);
  ns.tprint(ns.args);
  ns.getPurchasedServers().forEach((s) => ns.killall(s, true));
}
