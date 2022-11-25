import { getAllServers } from '/lib/utility.js';

/** @param {NS} ns */
export async function main(ns) {
  const { allServers, networkPaths } = getAllServers(ns);

  const servers = allServers.reduce((pv, cv) => {
    pv[cv.hostname] = cv;
    return pv;
  }, {});
  const backdoorPaths = networkPaths.map((path) => path.split(' => '));

  for (const path of backdoorPaths) {
    for (const server of path) {
      ns.singularity.connect(server);

      if (
        server !== 'home' &&
        servers[server].hasAdminRights &&
        !servers[server].backdoorInstalled &&
        ns.getHackingLevel() > servers[server].requiredHackingSkill
      ) {
        await ns.singularity.installBackdoor();

        ns.tprint(`Installed backdoor on ${server}`);

        servers[server].backdoorInstalled = true; // Mutate backdoor installed to prevent duplicate installs
      }
    }
  }
}
