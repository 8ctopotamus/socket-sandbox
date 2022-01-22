const os = require('os')

 function performanceData() {
  return new Promise(async resolve => {
    const osType = os.type() === 'Darwin' ? 'Mac' : os.type()
    const upTime = os.uptime()
    const freeMem = os.freemem()
    const totalMem = os.totalmem()
    const usedMem = totalMem - freeMem
    const memUsage = Math.floor(usedMem / totalMem * 100) / 100
    const cpus = os.cpus()
    const cpuModel = cpus[0].model
    const cpuSpeed = cpus[0].speed
    const numCors = cpus.length
    const cpuLoad = await getCPULoad()
    resolve({
      osType,
      upTime,
      freeMem,
      totalMem,
      usedMem,
      memUsage,
      cpuModel,
      cpuSpeed,
      numCors,
      cpuLoad,
    })
  })
}

function cpuAverage() {
  const cpus = os.cpus()
  let idleMs = 0
  let totalMs = 0
  cpus.forEach(core => {
    for (type in core.times) {
      totalMs += core.times[type]
    }
    idleMs += core.times.idle
  })
  return { 
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  }
}

function getCPULoad() {
  const start = cpuAverage()
  return new Promise(resolve => {
    setTimeout(() => {
      const end = cpuAverage()
      const idleDifference = end.idle - start.idle
      const totalDifference = end.total - start.total
      const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference)
      resolve(percentageCpu)
    }, 100)
  })
}

performanceData().then(allPerformanceData => console.log(allPerformanceData))