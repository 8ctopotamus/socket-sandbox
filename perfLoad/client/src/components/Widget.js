import CPU from "./CPU"
import Info from "./Info"
import Mem from "./Mem"
import './widget.css'

const Widget = ({ 
  data: {
    macA,
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
  } 
}) => {
  const cpu = { cpuLoad }
  const mem = { totalMem, usedMem, memUsage, freeMem }
  const info = { macA, osType, upTime, cpuModel, cpuSpeed, numCors }
  return (
    <>
      <div>
        <CPU cpuData={cpu} />
        <Mem memData={mem} />
        <Info infoData={info} />
      </div>
    </>
  )
}

export default Widget