/** @param {NS} ns */
export async function main(ns) {
  const options = ns.flags([
    ['script', ''],
    ['threaded', false],
    ['args', ''],
  ]);

  if (!options.script) {
    ns.tprint('No script provided');

    return;
  }

  ns.getPurchasedServers().forEach((s) => {
    let threads = 1;
    if (options.threaded) {
      threads = (ns.getServerMaxRam(s) - ns.getServerUsedRam(s)) / ns.getScriptRam(options.script);
    }

    ns.exec(...[options.script, s, threads, ...options.args.split(' ')]);
  });
}
