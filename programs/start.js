import { getAllServers } from '/lib/utility.js';

const JOBS = {
  thresholdWeaken: '/jobs/thresholdWeaken.js',
  maxWeaken: '/jobs/maxWeaken.js',
  thresholdGrow: '/jobs/thresholdGrow.js',
  maxGrow: '/jobs/maxGrow.js',
};

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');

  const servers = getAllServers(ns)
    .allServers.filter(
      (s) =>
        s.hostname !== 'home' &&
        s.moneyMax &&
        s.numOpenPortsRequired <= s.openPortCount &&
        s.requiredHackingSkill < ns.getHackingLevel()
    )
    .sort((a, b) => a.moneyMax - b.moneyMax);

  const host = ns.getHostname();

  const maxWeakenThreads =
    (ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(JOBS.maxWeaken);
  const maxGrowThreads =
    (ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(JOBS.maxGrow);

  const processes = [
    { description: 'First Weaken', job: JOBS.maxWeaken, threads: maxWeakenThreads },
    { description: 'Grow', job: JOBS.maxGrow, threads: maxGrowThreads },
    { description: 'Last Weaken', job: JOBS.maxWeaken, threads: maxWeakenThreads },
  ];

  const toProcess = servers.length;
  let processedCount = 0;

  for (const server of servers) {
    ns.tprint(`Setting up: ${server.hostname}.`);

    for (const process of processes) {
      const pid = ns.run(process.job, process.threads, server.hostname);

      while (ns.isRunning(pid)) {
        await ns.sleep(1000);
      }

      ns.tprint(`${process.description} complete.`);
    }

    processedCount++;

    ns.tprint(`Finished: ${server.hostname}. ${toProcess - processedCount} servers remaining.`);
  }
}
