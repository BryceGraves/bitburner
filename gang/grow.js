const GROWTH_THRESHOLD = 1.3;

/** @param {NS} ns */
export async function main(ns) {
  const gn = ns.gang;
  const equipment = gn.getEquipmentNames();

  while (await ns.sleep(10000)) {
    gn.getMemberNames()
      .map((m) => ({ name: m, details: gn.getAscensionResult(m) }))
      .forEach((m) => {
        if (!m.details) {
          return;
        }

        ns.print(`${m.name}, mults: ${JSON.stringify(m.details, undefined, '  ')}`);

        for (const [attribute, mult] of Object.entries(m.details)) {
          if (attribute === 'respect') {
            continue;
          }

          if (mult > GROWTH_THRESHOLD) {
            gn.ascendMember(m.name);
            equipment.forEach((e) => gn.purchaseEquipment(m.name, e));

            ns.tprint(`Ascended: ${m.name}`);

            break;
          }
        }
      });
  }
}
