/** @param {NS} ns */
export async function main(ns) {
  const currentMoney = ns.getPlayer().money;

  let mult = 20;
  while (currentMoney < ns.getPurchasedServerCost(Math.pow(2, mult))) {
    mult--;
  }

  const serverRam = Math.pow(2, mult);

  const servers = ns.getPurchasedServers();

  while (ns.purchaseServer(`s-${servers.length}`, serverRam)) {
    servers.push(`s-${servers.length}`);
  }

  servers.forEach((s) => ns.run('/scripts/copy.js', 1, s));

  // const servers = ns.getPurchasedServers();

  // servers.forEach((s) => ns.deleteServer(s))
}
