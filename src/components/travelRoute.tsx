import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

const TOKEN = import.meta.env.VITE_MAPBOX

const TravelRoute = () => {
   const location = useLocation()
   const data = location.state
   const mapRef = useRef<mapboxgl.Map | null>(null)
   const mapContainerRef = useRef<HTMLDivElement>(null)
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [isMapLoaded, setIsMapLoaded] = useState(false)
   // console.log(data)
   const charCode = 65
   useEffect(() => {
      if (!mapContainerRef.current) return

      mapboxgl.accessToken = TOKEN
      const map = new mapboxgl.Map({
         container: mapContainerRef.current,
         center: [77.2088, 28.6139],
         style: "mapbox://styles/mapbox/dark-v11",
         zoom: 5,
      })
      mapRef.current = map

      mapRef.current.on("load", () => {
         setIsMapLoaded(true)

         // Add your array of coordinates as a GeoJSON source
         mapRef.current?.addSource("points", {
            type: "geojson",
            data: {
               type: "FeatureCollection",
               features: data.coordinates.map((coord: number[]) => ({
                  type: "Feature",
                  geometry: {
                     type: "Point",
                     coordinates: coord,
                  },
               })),
            },
         })
         mapRef.current?.addLayer({
            id: "points",
            type: "circle",
            source: "points",
            paint: {
               "circle-radius": 7,
               "circle-color": "#2563eb",
            },
         })
      })

      return () => {
         if (mapRef.current) mapRef.current.remove()
      }
   }, [data])
   return (
      <div className="w-full h-full p-10 flex text-white">
         <ol className="relative w-[50%] space-y-5">
            <div className="flex flex-wrap jusitfy-around gap-2">
               <p className="flex flex-nowrap gap-4 text-lg border-2 border-blue-600 px-6 py-4 rounded-lg text-nowrap">
                  <span>Total Distance:</span>
                  {(data.solution.totalDistance / 1000).toFixed(2)} km
               </p>
               <p className="flex gap-4 text-lg border-2 border-blue-600 px-6 py-4 rounded-lg text-nowrap">
                  <span>Total Duration:</span>
                  {(data.solution.totalTime / 3600).toFixed(2)} hours
               </p>
            </div>

            <h1 className="text-lg lg:ps-10">Route:</h1>
            {data.solution.optimalPath.map(
               (locationIndex: number, index: number) => (
                  <li
                     key={index}
                     className="flex jusitfy-start items-center lg:ps-10 gap-5"
                  >
                     <span className="rounded-full h-10 w-10 ps-[15px] pt-[8px] bg-blue-600 text-white">
                        {String.fromCharCode(charCode + index)}
                     </span>
                     <h1 className="text-white text-lg">
                        {data.names[locationIndex]}
                     </h1>
                     {index === 0 && (
                        <span className="text-blue-600 border-2 border-blue-600 px-3 py-1 rounded-md uppercase text-xs">
                           Start
                        </span>
                     )}
                     {data.solution.optimalPath.length - 1 === index && (
                        <span className="text-blue-600 border-2 border-blue-600 px-3 py-1 rounded-md uppercase text-xs">
                           End
                        </span>
                     )}
                  </li>
               ),
            )}
         </ol>
         <div className="flex-grow h-[100%] rounded-lg" ref={mapContainerRef} />
      </div>
   )
}

export default TravelRoute
