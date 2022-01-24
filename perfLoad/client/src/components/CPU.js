import drawCircle from '../utilities/canvasLoadAnimation'

const CPU = ({ cpuData: { cpuLoad } }) => {
  const canvas = document.querySelector('canvas')
  drawCircle(canvas, cpuLoad)

  return (
    <div className="col-sm-3">
      <h3>CPU Load</h3>
      <div className='canvas-wrapper'>
        <canvas className='canvas' />
        <div className='cpu-text'>{cpuLoad}</div>
      </div>
    </div>
  )
}

export default CPU