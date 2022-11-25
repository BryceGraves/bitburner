// import { getAllServers } from '/lib/utility.js';

/** @param {NS} ns */
export async function main(ns) {
  // const serverInfo = getAllServers(ns);

  // const serversWithContracts = serverInfo.allServers
  //   .filter((s) => ns.ls(s.hostname, 'cct').length)
  //   .map((s) => s.hostname);

  // serversWithContracts
  //   .map((s) => serverInfo.backdoorCommands.find((c) => c.endsWith(`${s}; b`)))
  //   .forEach((v) => ns.tprint(v));

  ns.tprint(ns.heart.break());
}
