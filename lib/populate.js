/** @param {NS} ns */
export async function main(ns) {
  const allFunctions = {
    parsedWeaken: ns.weaken.toString(),
    parsedGrow: ns.grow.toString(),
    parsedGrowthAnalyze: ns.growthAnalyze.toString(),
  };

  ns.clearPort(1);

  await ns.writePort(1, JSON.stringify(allFunctions));
}
