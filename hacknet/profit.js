/** @param {NS} ns */
export async function main(ns) {
  const hn = ns.hacknet;

  while (await ns.sleep(1000)) {
    hn.spendHashes('Sell for Money', '', hn.numHashes() / 4);
  }
}
