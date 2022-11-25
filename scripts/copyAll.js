import { getAllServers } from '/lib/utility.js';

/** @param {NS} ns */
export async function main(ns) {
  const files = ns.ls('home', 'js');

  const { allServers } = getAllServers(ns);

  for (const server of allServers) {
    await ns.scp(files, server.hostname, 'home');
  }
}
