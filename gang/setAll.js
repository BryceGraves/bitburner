// TODO: make territory warfare configurable by flag

/** @param {NS} ns */
export async function main(ns) {
  const gn = ns.gang;

  const task =
    ns.args[0] ||
    (await ns.prompt('Select offtime task:', { type: 'select', choices: gn.getTaskNames() }));

  // const timings = [];

  // while (timings.length <= 20) {
  //     const start = Date.now();

  //     setAllMembersToTask(gn, timings.length % 2 ? task : 'unassigned')

  //     timings.push(Date.now() - start);

  //     await ns.sleep(10); // let things calm down before timing again
  // }

  setAllMembersToTask(gn, task);

  // const taskUpdateOffset = timings.reduce((pv, cv) => pv + cv, 0) / timings.length
  const taskUpdateOffset = 10;

  let { name: gangToWatch, power: previousPower } = getMostPowerfulGang(gn);
  let updated = false;

  while (!updated) {
    await ns.sleep(1);

    const currentPower = Math.floor(gn.getOtherGangInformation()[gangToWatch].power);
    if (currentPower != previousPower) {
      updated = true;
    }
  }

  await ns.sleep(19900);

  while (true) {
    setAllMembersToTask(gn, 'Territory Warfare');

    await ns.sleep(200);

    setAllMembersToTask(gn, task);

    await ns.sleep(19800 - taskUpdateOffset);
  }
}

/** @param {Gang} gn */
function getMostPowerfulGang(gn) {
  let gangToWatch = '';
  let maxPower = 0;
  for (const [gangName, details] of Object.entries(gn.getOtherGangInformation())) {
    if (gn.getGangInformation().faction === gangName) {
      continue;
    }

    if (details.power > maxPower) {
      gangToWatch = gangName;
      maxPower = details.power;
    }
  }

  return { name: gangToWatch, power: Math.floor(maxPower) };
}

/**
 * @param {Gang} gn
 * @param {string} task
 */
function setAllMembersToTask(gn, task) {
  gn.getMemberNames().forEach((m) => gn.setMemberTask(m, task));
}
