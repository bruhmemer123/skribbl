
const Message = ({data}) => {
  return (
    <div className={`text-sm p-1 rounded ${isSystem ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-800'}`}>
      <span className="font-bold">{data.username || "Guest"}: </span>
      <span>{data.text || data}</span>
    </div>
  )
}

export default Message