import { getAllServers } from '/lib/utility.js';

const JOBS = ['/jobs/weaken.js', '/jobs/grow.js'];
const FILES = ['/programs/farm.js', '/lib/hacking.js', '/lib/utility.js', ...JOBS];

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');

  const files = ns.ls('home', 'js');

  const hackingCommands = [
    {
      available: ns.fileExists('BruteSSH.exe', 'home'),
      fn: (server) => ns.brutessh(server.hostname),
    },
    {
      available: ns.fileExists('FTPCrack.exe', 'home'),
      fn: (server) => ns.ftpcrack(server.hostname),
    },
    {
      available: ns.fileExists('relaySMTP.exe', 'home'),
      fn: (server) => ns.relaysmtp(server.hostname),
    },
    {
      available: ns.fileExists('HTTPWorm.exe', 'home'),
      fn: (server) => ns.httpworm(server.hostname),
    },
    {
      available: ns.fileExists('SQLInject.exe', 'home'),
      fn: (server) => ns.sqlinject(server.hostname),
    },
    { available: ns.fileExists('NUKE.exe', 'home'), fn: nuke(ns) },
  ];

  const openablePorts = hackingCommands.reduce((pv, cv) => {
    pv += +cv.available;
    return pv;
  }, -1); // sub one for nuke

  const { allServers: firstFetch } = getAllServers(ns);

  for (const server of firstFetch) {
    await runAvailableCommands(hackingCommands, server);
  }

  const processingCommands = [
    { available: true, isAsync: true, fn: copy(ns, files) },
    { available: true, isAsync: true, fn: setupServer(ns) },
  ];

  const { allServers } = getAllServers(ns);

  for (const server of allServers) {
    await runAvailableCommands(processingCommands, server);
  }
}

const copy = (ns, files) => async (server) => await ns.scp(files, 'home', server.hostname);

/** @param {NS} ns  */
const nuke = (ns) => (server) => {
  if (server.openPortCount < server.numOpenPortsRequired) {
    ns.tprint(
      `${server.hostname}: not hacked, have ${server.openPortCount} need ${server.numOpenPortsRequired}`
    );

    return;
  }

  ns.nuke(server.hostname);
};

const runAvailableCommands = async (commands, server) => {
  for (const c of commands) {
    c.available && (c.isAsync ? await c.fn(server) : c.fn(server));
  }
};

/** @param {NS} ns */
const setupServer = (ns) => async (server) => {
  const scriptLocation = FILES[0];
  const serverHostname = server.hostname;
  const playerHackingLevel = ns.getHackingLevel();

  if (!ns.hasRootAccess(serverHostname)) {
    return;
  }

  if (playerHackingLevel < server.requiredHackingSkill) {
    ns.tprint(
      `Player hacking level too low to hack ${serverHostname}. ${playerHackingLevel} < ${server.requiredHackingSkill}`
    );

    return;
  }

  if (ns.ps(serverHostname).some((p) => JOBS.includes(p.filename))) {
    ns.tprint(`Batch processing already running on: ${serverHostname}`);

    return;
  }

  const availableRam = ns.getServerMaxRam(serverHostname) - ns.getServerUsedRam(serverHostname);
  const numberOfThreads = Math.floor(availableRam / ns.getScriptRam(scriptLocation));

  if (numberOfThreads < 1) {
    ns.tprint(`Can't setup ${serverHostname} with 0 threads available`);

    return;
  }

  const res = ns.exec(scriptLocation, serverHostname, 1, serverHostname)
    ? `Now batch processing on ${serverHostname}`
    : `Couldn't start on ${serverHostname} with ${numberOfThreads} threads`;

  ns.tprint(res);
};
