/** @param {NS} ns */
export async function main(ns) {
  if (!ns.args.length) {
    ns.tprint('No server given, shutting down');

    return;
  }

  ns.disableLog('ALL');

  const server = ns.args[0];

  // ns.connect(server);

  const hackingCommands = [
    { available: false, fileName: 'BruteSSH.exe', fn: ns.brutessh },
    { available: false, fileName: 'FTPCrack.exe', fn: ns.ftpcrack },
    { available: false, fileName: 'relaySMTP.exe', fn: ns.relaysmtp },
    { available: false, fileName: 'HTTPWorm.exe', fn: ns.httpworm },
    { available: false, fileName: 'SQLInject.exe', fn: ns.sqlinject },
    { available: false, fileName: 'NUKE.exe', fn: ns.nuke },
    { available: true, isAsync: true, fn: setupServer(ns) },
  ];

  updateAvailableCommands(ns, hackingCommands);

  const nearbyServers = ns.scan(server).filter((s) => s !== 'home');

  for (const s of nearbyServers) {
    await runAvailableCommands(hackingCommands, s);
  }

  // ns.installBackdoor();
}

const runAvailableCommands = async (commands, server) => {
  for (const c of commands) {
    c.available && (c.isAsync ? await c.fn(server) : c.fn(server));
  }
};

const updateAvailableCommands = (ns, commands) =>
  commands.forEach((_, i) => {
    commands[i].fileName && (commands[i].available = ns.fileExists(commands[i].fileName, 'home'));
  });

/** @param {NS} ns */
const setupServer = (ns) => async (server) => {
  const scriptLocation = '/programs/farm.js';
  const isRoot = ns.hasRootAccess(server);
  const scriptAlreadyRunning = ns.ps(server).some((p) => p.filename === scriptLocation);

  if (!isRoot) {
    ns.tprint(`No root access on ${server}`);

    return;
  }

  if (scriptAlreadyRunning) {
    ns.tprint(`Script already running on ${server}`);

    return;
  }

  const copied = await ns.scp(scriptLocation, 'home', server);

  const availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
  const numberOfThreads = Math.floor(availableRam / ns.getScriptRam(scriptLocation));

  if (numberOfThreads < 1) {
    ns.tprint(
      `Can't setup ${scriptLocation} on ${server} with ${numberOfThreads} number of threads. Copied?: ${copied}`
    );

    return;
  }

  if (!ns.exec(scriptLocation, server, numberOfThreads, server)) {
    ns.tprint(
      `Couldn't start start ${scriptLocation} on ${server} with ${numberOfThreads} threads`
    );
  }

  ns.tprint(`${scriptLocation} now running on ${server}`);
};
