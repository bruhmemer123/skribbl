//Currently track only the position of the mouse when let go,fix to draw while dragging
const GamePage = () => {
  const handleDraw = (e) => {
    const canvas = e.target
    const ctx = canvas.getContext('2d')
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fill()
  }
  return (
    <div className="min-h-screen flex justify-center items-center">
        <canvas id="canvas" className="bg-white border border-gray-600" width={"800"} height={"600"} onClick={handleDraw}></canvas>
    </div>
  )
}

export default GamePage