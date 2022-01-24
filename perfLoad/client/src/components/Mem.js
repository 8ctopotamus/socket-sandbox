import drawCircle from '../utilities/canvasLoadAnimation'

const Mem = ({
  memData: { 
    totalMem,
    usedMem,
    memUsage,
    freeMem, 
    memWidgetId
  }
}) => {
  const canvas = document.getElementById(memWidgetId)
  const finalMemUseage = memUsage * 100
  const totalMemInGB = Math.floor(totalMem/1073741824*100)/100
  const freeMemInGB = Math.floor(freeMem/1073741824*100)/100
  drawCircle(canvas, finalMemUseage)
  return (
    <div className="col-sm-3 mem">
      <h3>Memory Useage</h3>
      <div className='canvas-wrapper'>
        <canvas id={memWidgetId} height={200} width={200} />
        <div className='mem-text'>{finalMemUseage}%</div>
        <div>Total Memory: {totalMemInGB}</div>
        <div>Free Memory: {freeMemInGB}</div>
      </div>
    </div>
  )
}

export default Mem