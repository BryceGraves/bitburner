/** @param {NS} ns */
export async function main(ns) {
  if (!ns.args.length) {
    ns.tprint('No server given, shutting down');

    return;
  }

  const files = ns.ls('home', 'js');

  await ns.scp(files, 'home', ns.args[0]);
}
