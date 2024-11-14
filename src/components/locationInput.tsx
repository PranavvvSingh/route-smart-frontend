import { Geocoder } from "@mapbox/search-js-react"
import mapboxgl from "mapbox-gl"

const TOKEN = import.meta.env.VITE_MAPBOX

interface LocationInputProps {
   mapRef: React.MutableRefObject<mapboxgl.Map | null>
   inputValue: string
   setInputValue: React.Dispatch<React.SetStateAction<string>>
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   handleRetrieve: (result: any) => void
}

function LocationInput({
   mapRef,
   inputValue,
   setInputValue,
   handleRetrieve,
}: LocationInputProps) {
   return (
      <Geocoder
         accessToken={TOKEN}
         map={mapRef.current ?? undefined}
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
               border: "1.5px solid #2590EB",
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
   )
}

export default LocationInput
