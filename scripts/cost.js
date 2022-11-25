/** @param {NS} ns */
export async function main(ns) {
  const mult = 20;
  const serverRam = Math.pow(2, mult);

  ns.tprint(ns.getPurchasedServerCost(serverRam) / 1000000000);
}
