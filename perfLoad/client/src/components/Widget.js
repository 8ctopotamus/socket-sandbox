import CPU from "./CPU"
import Info from "./Info"
import Mem from "./Mem"

const Widget = () => {
  return (
    <>
      <div>
        <CPU />
        <Mem />
        <Info />
      </div>
    </>
  )
}

export default Widget