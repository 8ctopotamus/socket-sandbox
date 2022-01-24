import drawCircle from '../utilities/canvasLoadAnimation'

const CPU = ({ cpuData, cpuWidgetId }) => {
  const canvas = document.getElementById('cpuWidgetId')
  drawCircle(canvas, cpuData.cpuLoad)

  return (
    <div className="col-sm-3">
      <h3>CPU Load</h3>
      <div className='canvas-wrapper'>
        <canvas id={cpuWidgetId} height={200} width={200} />
        <div className='cpu-text'>{cpuData.cpuLoad}</div>
      </div>
    </div>
  )
}

export default CPU