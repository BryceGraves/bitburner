const JOBS = {
  thresholdWeaken: '/jobs/thresholdWeaken.js',
  maxWeaken: '/jobs/maxWeaken.js',
  thresholdGrow: '/jobs/thresholdGrow.js',
  maxGrow: '/jobs/maxGrow.js',
};

/** @param {NS} ns */
export async function main(ns) {
  const server =
    ns.args[0] || (await ns.prompt('No server given, enter server now:', { type: 'text' }));

  if (!server) {
    return;
  }

  // ns.disableLog('ALL');

  const host = ns.getHostname();

  const maxWeakenThreads =
    (ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(JOBS.maxWeaken);
  const maxWeakenPID = ns.run(JOBS.maxWeaken, maxWeakenThreads, server);

  while (ns.isRunning(maxWeakenPID)) {
    await ns.sleep(1000);
  }

  // const weakenThreads = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(JOBS.weaken);
  // const growThreads = (ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(JOBS.grow);

  // const securityReduction = ns.weakenAnalyze(weakenThreads);

  // const securityGrowIncrease = ns.growthAnalyzeSecurity(growThreads, server);
  // const securityHackncrease = ns.hackAnalyzeSecurity(growThreads, server);

  const availableRam =
    ns.getServerMaxRam(host) - (ns.getServerUsedRam(host) - ns.getScriptRam(ns.getScriptName()));

  // let weakenPID = ns.run(JOBS.weaken, weakenThreads, server);

  // while ((ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server)) > securityReduction) { await ns.sleep(100); };

  // ns.kill(weakenPID);

  // let growPID = ns.run(JOBS.grow, growThreads, server);

  // while (ns.getServerMoneyAvailable(server) < (ns.getServerMaxMoney(server) * MAX_MONEY_THRESHOLD)) {
  //     if ((ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server)) > securityReduction) {
  //         ns.kill(growPID);

  //         const currentSecurityLevel = Math.ceil(ns.getServerSecurityLevel(server));

  //         weakenPID = ns.run(JOBS.weaken, weakenThreads, server);

  //         while (currentSecurityLevel >= ns.getServerSecurityLevel(server)) { await ns.sleep(100); };

  //         ns.kill(weakenPID);

  //         growPID = ns.run(JOBS.grow, growThreads, server);
  //     }

  //     await ns.sleep(100);
  // };

  // ns.kill(growPID);

  [JOBS.thresholdWeaken, JOBS.thresholdGrow].forEach((j, i, jobs) => {
    const threads = availableRam / jobs.length / ns.getScriptRam(j);
    const fn = i === jobs.length - 1 ? ns.spawn : ns.run;

    fn(j, threads, server);
  });
}
