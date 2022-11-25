/** @param {NS} ns */
export async function main(ns) {
  const hn = ns.hacknet;

  const servers = Array.from({ length: hn.numNodes() }, serverGenerator(hn));

  let upgradeableServerIndex = 0;
  for (; upgradeableServerIndex < hn.numNodes(); upgradeableServerIndex++) {
    if (Object.values(servers[upgradeableServerIndex]).some((v) => v !== Infinity)) {
      break;
    }
  }

  ns.print('starting server processing');

  while (servers[upgradeableServerIndex]) {
    ns.print('upgradeableServerIndex', upgradeableServerIndex);

    if (servers.length !== hn.numNodes()) {
      ns.print('Adding servers:', hn.numNodes() - servers.length);

      Array.from({ length: hn.numNodes() - servers.length }, serverGenerator(hn)).forEach((v) =>
        servers.push(v)
      );
    }

    for (let i = upgradeableServerIndex; i < hn.numNodes(); i++) {
      hn.upgradeLevel(i, 1);
      hn.upgradeRam(i, 1);
      hn.upgradeCore(i, 1);

      ns.print('finished upgrading server: ', i);

      servers[i] = serverGenerator(hn)(undefined, i);

      ns.print('new server: ', servers[i]);

      if (Object.values(servers[i]).every((v) => v === Infinity)) {
        upgradeableServerIndex = i;
      }
    }

    hn.purchaseNode();

    await ns.sleep(1000);
  }
}

/** @param {Hacknet} hn */
const serverGenerator = (hn) => (_, i) => ({
  level: hn.getLevelUpgradeCost(i, 1),
  ram: hn.getRamUpgradeCost(i, 1),
  cores: hn.getCoreUpgradeCost(i, 1),
});
