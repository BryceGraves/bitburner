/** @param {NS} ns */
export async function main(ns) {
  if (!ns.args.length) {
    ns.tprint('No server given, shutting down');

    return;
  }

  ns.tprint(countWays(ns.args[0]));
}

// TODO: improve this and actually figure out how this works...
const countWays = (n) => {
  const table = Array.from({ length: n + 1 }, (_, i) => +!!!i);

  table[0] = 1;

  for (let i = 1; i < n; i++) {
    for (let j = i; j <= n; j++) {
      table[j] += table[j - i];
    }
  }

  return table[n];
};
