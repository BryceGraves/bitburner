/** @param {NS} ns */
export async function main(ns) {
  const gn = ns.gang;
  const equipment = gn.getEquipmentNames();

  while (true) {
    gn.getMemberNames().forEach((m) => equipment.forEach((e) => gn.purchaseEquipment(m, e)));

    await ns.sleep(10000);
  }
}
