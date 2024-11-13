import { useEffect, useRef, useState } from "react"
import mapboxgl, { Marker } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Geocoder } from "@mapbox/search-js-react"

const TOKEN = import.meta.env.VITE_MAPBOX

function Home() {
   const mapRef = useRef<mapboxgl.Map | null>(null)
   const mapContainerRef = useRef<HTMLDivElement>(null)
   const [inputValue, setInputValue] = useState("")
   const [isMapLoaded, setIsMapLoaded] = useState(false)
   const [markers, setMarkers] = useState<Marker[]>([])

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const handleRetrieve = (result: any) => {
      console.log("retrieve")
      if (result) {
         const coordinates = result.geometry.coordinates
         if (mapRef.current) {
            const newMarker = new mapboxgl.Marker({
               color: markers.length === 0 ? "red" : "green",
            })
               .setLngLat(coordinates)
               .setPopup(
                  new mapboxgl.Popup({
                     closeOnMove: true,
                  }).setText(
                     `Latitude: ${coordinates[0]} Longitude: ${coordinates[1]}`,
                  ),
               )
               .addTo(mapRef.current)
            setMarkers((prevMarkers) => [...prevMarkers, newMarker])
            setInputValue("")
         }
      }
   }

   const removeMarker = (index: number) => {
      markers[index].remove()
      setMarkers((prevMarkers) => prevMarkers.filter((_, i) => i !== index))
   }

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
         console.log("loaded")
      })

      return () => {
         if (mapRef.current) mapRef.current.remove()
      }
   }, [])

   return (
      <div className="h-[100%] w-[100%] flex gap-10 p-10 items-center">
         <div className="w-[40%] h-[400px]">
            {isMapLoaded && mapRef.current && (
               <Geocoder
                  accessToken={TOKEN}
                  map={mapRef.current}
                  mapboxgl={mapboxgl}
                  value={inputValue}
                  onChange={(d) => {
                     setInputValue(d)
                  }}
                  onRetrieve={handleRetrieve}
                  marker={{
                     color: "green",
                  }}
                  theme={{
                     variables: {
                        fontFamily: "helvetica neue, sans-serif",
                        border: "2px solid #424242",
                        borderRadius: "5px",
                        colorText: "#EDEADE",
                        colorBackdrop: "#EDEADE",
                        colorBackground: "#212121",
                        colorBackgroundHover: "#474747",
                        fontWeight: "400",
                        fontWeightBold: "400",
                        fontWeightSemibold: "400",
                        lineHeight: "1.4",
                     },
                     cssText: `
                                 [class$="--Input"] {
                                 color: #EDEADE;
                                 border: none;
                                 }
                                 [class$="--Input"]:focus {
                                 color: #EDEADE;
                                 border: none;
                                 }
                                 [class$="--Input"]::placeholder {
                                 color: #EDEADE;
                                 opacity: 0.7;
                                 }
                              `,
                  }}
               />
            )}
            {markers.map((_item, index) => (
               <div onClick={() => removeMarker(index)}>{index}</div>
            ))}
         </div>
         <div className="flex-grow h-[100%] rounded-lg" ref={mapContainerRef} />
      </div>
   )
}

export default Home
