/** @param {NS} ns */
export async function main(ns) {
  const handlers = getPortHandlers(ns);

  while (true) {
    await ns.sleep(1000);

    for (const handler of handlers) {
      if (!handler.port.empty()) {
        ns.tprint(`Invoking handler: ${handler.name}`);

        await handler.fn();
      }
    }
  }
}

/** @param {NS} ns */
const getPortHandlers = (ns) =>
  Object.entries(PORTS).map(([portNumber, data]) => {
    const port = ns.getPortHandle(portNumber);

    return {
      name: data.name,
      fn: data.fn(ns, port),
      port,
    };
  });

/**
 * @param {NS} ns
 * @param {NetscriptPort} port
 */
const completeServerHandler = (ns, port) => async () =>
  await ns.write('complete_servers.txt', `\r\n${port.read()}`, 'a');

const PORTS = {
  1: {
    name: 'COMPLETE_SERVER_QUEUE',
    fn: completeServerHandler,
  },
};
