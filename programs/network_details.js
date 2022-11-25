import { getAllServers } from '/lib/utility.js';

/** @param {NS} ns */
export async function main(ns) {
  const serverInfo = getAllServers(ns);
  ns.tprint(JSON.stringify(serverInfo, null, 2));

  const fileDetails = serverInfo.allServers.reduce((pv, cv) => {
    pv[cv.hostname] = ns.ls(cv.hostname);
    return pv;
  }, {});

  ns.tprint(JSON.stringify(fileDetails, null, 2));

  serverInfo.backdoorCommands.forEach((cmd) => ns.print(cmd));

  const hackingLevel = ns.getHackingLevel();
  const filteredServers = serverInfo.allServers
    .filter((s) => s.moneyMax && s.requiredHackingSkill < hackingLevel)
    .sort((a, b) => a.moneyMax - b.moneyMax);

  ns.tprint(
    JSON.stringify(
      filteredServers.map((s) => s.hostname),
      null,
      2
    )
  );
}
