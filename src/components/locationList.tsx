import Close from "./../assets/close.svg?react"

interface LocationListProps {
   markerNames: string[]
   removeMarker: (index: number) => void
}
const LocationList = ({ markerNames, removeMarker }: LocationListProps) => {
   return (
      <div className="space-y-5 mt-5 px-2">
         {markerNames.map((name, index) => (
            <div
               key={name + index}
               className="flex justify-between items-center text-white border border-gray-700 rounded px-4 py-2 overflow-ellipsis hover:border-blue-600"
            >
               <h2>{name}</h2>
               <Close fill={"#e5e7eb"} height={17} width={17} onClick={() => removeMarker(index)} className="cursor-pointer"/>
            </div>
         ))}
      </div>
   )
}

export default LocationList
