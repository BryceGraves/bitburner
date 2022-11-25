import { getAllServers } from '/lib/utility.js';

const SCRIPT = '/programs/farm.js';

/** @param {NS} ns */
export async function main(ns) {
  const hackingLevel = ns.getHackingLevel();
  const filteredServers = getAllServers(ns)
    .allServers.filter(
      (s) => s.moneyMax && s.hasAdminRights && s.requiredHackingSkill < hackingLevel
    )
    .sort((a, b) => b.moneyMax - a.moneyMax)
    .map((s) => s.hostname);

  ns.getPurchasedServers().forEach((s, i) => {
    ns.killall(s, true);
    ns.exec(SCRIPT, s, 1, filteredServers[i]);
  });
}
