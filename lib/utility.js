/** @param {NS} ns */
export function getAllServers(ns) {
  const serverSet = new Set(['home']);
  const networkPaths = ['home'];

  _getAllServers(ns, serverSet, networkPaths, 'home', 'home');

  const allServers = [...serverSet].map((s) => ns.getServer(s));

  const backdoorCommands = networkPaths.map((path) => `cn ${path.split(' => ').join('; cn ')}; b`);

  return { allServers, backdoorCommands, networkPaths };
}

/**
 * @param {NS} ns
 * @param {Set<string>} servers
 * @param {string[]} networkPaths
 * @param {string} server
 * @param {string} base
 */
const _getAllServers = (ns, servers, networkPaths, server, base) => {
  const nearbyServers = ns.scan(server).filter((s) => !servers.has(s));

  nearbyServers.forEach((s) => {
    servers.add(s);
    networkPaths.push(`${base} => ${s}`);
  });
  nearbyServers.forEach((s) => _getAllServers(ns, servers, networkPaths, s, `${base} => ${s}`));
};
