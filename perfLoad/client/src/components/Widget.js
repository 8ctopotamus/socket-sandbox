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
    isActive,
  } 
}) => {
  const cpuWidgetId = `cpu-widget-${macA}`
  const memWidgetId = `mem-widget-${macA}`
  const cpu = { cpuLoad, cpuWidgetId }
  const mem = { totalMem, usedMem, memUsage, freeMem, memWidgetId }
  const info = { macA, osType, upTime, cpuModel, cpuSpeed, numCors }
  return (
    <div className="row">
      {macA}
      {!isActive && (
        <div className="not-active">OFFLINE</div>
      )}
      <CPU cpuData={cpu} />
      <Mem memData={mem} />
      <Info infoData={info} />
    </div>
  )
}

export default Widget