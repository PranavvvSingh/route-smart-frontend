import { useEffect, useRef, useState } from "react"
import mapboxgl, { Marker } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import LocationInput from "./locationInput"
import { cn } from "../utils/cn"
import ProfileInput from "./profileInput"
import LocationList from "./locationList"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Spinner from "./spinner"

const TOKEN = import.meta.env.VITE_MAPBOX

function Home() {
   const mapRef = useRef<mapboxgl.Map | null>(null)
   const mapContainerRef = useRef<HTMLDivElement>(null)
   const [inputValue, setInputValue] = useState("")
   const [isMapLoaded, setIsMapLoaded] = useState(false)
   const [markers, setMarkers] = useState<Marker[]>([])
   const [markerNames, setMarkerNames] = useState<string[]>([])
   const [primaryMarker, setPrimaryMarker] = useState<Marker>()
   const [primaryMarkerName, setPrimaryMarkerName] = useState<string>()
   const [profile, setProfile] = useState<string>("driving")
   const [priority, setPriority] = useState<string>("distance")
   const [loading, setLoading] = useState(false)
   const navigate = useNavigate()

   const [activeStep, setActiveStep] = useState(1)
   const handleNext = () => {
      if (activeStep < 3) setActiveStep((cur) => cur + 1)
      if (activeStep == 2) panOut()
      setInputValue("")
   }
   const handlePrev = () => {
      if (activeStep != 1) setActiveStep((cur) => cur - 1)
      setInputValue("")
   }

   const fetchData = async () => {
      setLoading(true)
      let lngLat = primaryMarker?.getLngLat()
      const coordinates = [[lngLat?.lng, lngLat?.lat]]
      markers.forEach((marker) => {
         lngLat = marker.getLngLat()
         coordinates.push([lngLat.lng, lngLat.lat])
      })
      // console.log(coordinates)
      const res = await axios.post("http://localhost:3000/api/coordinates", {
         coordinates,
         profile,
         priority,
         names: [primaryMarkerName, ...markerNames],
      })
      // console.log(res.data)
      navigate("/travel", { state: res.data })
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const handleRetrieve = (result: any) => {
      // console.log(result)
      if (result && mapRef.current) {
         const coordinates = result.geometry.coordinates
         const newMarker = new mapboxgl.Marker({
            color: activeStep === 1 ? "red" : "green",
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
         if (activeStep !== 1) {
            setMarkers((prevMarkers) => [...prevMarkers, newMarker])
            setMarkerNames((prevNames) => [
               ...prevNames,
               result.properties.full_address,
            ])
         } else {
            if (primaryMarkerName) primaryMarker?.remove()
            setPrimaryMarker(newMarker)
            setPrimaryMarkerName(result.properties.full_address)
         }
         setInputValue("")
      }
   }

   const removeMarker = (index: number) => {
      markers[index].remove()
      setMarkerNames((prevNames) => prevNames.filter((_, i) => i !== index))
      setMarkers((prevMarkers) => prevMarkers.filter((_, i) => i !== index))
   }

   const panOut = () => {
      const bounds = new mapboxgl.LngLatBounds()
      markers.forEach(function (marker) {
         bounds.extend(marker.getLngLat())
      })

      // Use fitBounds to adjust the map view
      mapRef.current?.fitBounds(bounds, {
         padding: 50,
         maxZoom: 15,
         duration: 1000,
      })
   }

   const submit = () => fetchData()

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
      })

      return () => {
         if (mapRef.current) mapRef.current.remove()
      }
   }, [])

   if (loading)
      return (
         <div className="h-[100%] w-[100%] flex items-center justify-center">
            <Spinner />
         </div>
      )

   return (
      <div className="h-[100%] w-[100%] flex gap-10 p-10 items-center">
         <div className="w-[40%] h-full flex flex-col justify-between">
            <div className="flex items-center">
               <div className="flex items-center w-full">
                  <div className="w-8 h-8 shrink-0 mx-[-1px] bg-blue-600 p-1.5 flex items-center justify-center rounded-full">
                     <span className="text-base text-white font-bold">1</span>
                  </div>
                  <div
                     className={cn("w-full h-1", {
                        "bg-blue-600": activeStep > 1,
                        "bg-gray-700": activeStep <= 1,
                     })}
                  />
               </div>
               <div className="flex items-center w-full">
                  <div
                     className={cn(
                        "w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full",
                        {
                           "bg-blue-600": activeStep >= 2,
                           "bg-gray-700": activeStep < 2,
                        },
                     )}
                  >
                     <span className="text-base text-white font-bold">2</span>
                  </div>
                  <div
                     className={cn("w-full h-1", {
                        "bg-blue-600": activeStep > 2,
                        "bg-gray-700": activeStep <= 2,
                     })}
                  />
               </div>
               <div className="flex items-center">
                  <div
                     className={cn(
                        "w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full",
                        {
                           "bg-blue-600": activeStep === 3,
                           "bg-gray-700": activeStep !== 3,
                        },
                     )}
                  >
                     <span className="text-base text-white font-bold">3</span>
                  </div>
               </div>
            </div>
            {activeStep === 1 && (
               <div className="text-white px-5 capitalize text-lg">
                  Step 1: Add base location
               </div>
            )}
            {activeStep === 2 && (
               <div className="text-white px-5 capitalize text-lg">
                  Step 2: Add destination locations (max 5)
               </div>
            )}
            {activeStep === 3 && (
               <div className="text-white px-5 capitalize text-lg">
                  Step 3: Select mode & preference
               </div>
            )}
            {activeStep === 3 && (
               <div className="px-5 h-[400px] space-y-2">
                  <ProfileInput
                     profile={profile}
                     setProfile={setProfile}
                     priority={priority}
                     setPriority={setPriority}
                  />
               </div>
            )}
            {activeStep != 3 && (
               <div className="w-full px-5 h-[400px]">
                  {isMapLoaded && mapRef && mapRef.current && (
                     <LocationInput
                        mapRef={mapRef}
                        handleRetrieve={handleRetrieve}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                     />
                  )}
                  {activeStep === 2 && (
                     <LocationList
                        markerNames={markerNames}
                        removeMarker={removeMarker}
                     />
                  )}
               </div>
            )}
            <div className="flex justify-center gap-5">
               <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-medium outline-none bg-blue-700 hover:bg-blue-800 disabled:bg-gray-800"
                  onClick={handlePrev}
                  disabled={activeStep === 1}
               >
                  Back
               </button>

               <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-medium outline-none bg-blue-700 hover:bg-blue-800"
                  onClick={activeStep === 3 ? submit : handleNext}
               >
                  {activeStep === 3 ? "Go" : "Next"}
               </button>
            </div>
         </div>
         <div className="flex-grow h-[100%] rounded-lg" ref={mapContainerRef} />
      </div>
   )
}

export default Home
