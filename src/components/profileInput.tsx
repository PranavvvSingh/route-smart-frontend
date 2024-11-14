
interface ProfileInput {
   profile: string
   setProfile: React.Dispatch<React.SetStateAction<string>>
}
const ProfileInput = ({profile, setProfile}: ProfileInput) => {
  return (
     <>
        <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
           <input
              id="bordered-radio-1"
              type="radio"
              checked={profile === "driving"}
              onChange={() => setProfile("driving")}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
           />
           <label
              htmlFor="bordered-radio-1"
              className="w-full py-4 ms-4 text-sm font-medium text-gray-900 dark:text-gray-300"
           >
              Driving
           </label>
        </div>
        <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
           <input
              checked={profile === "walking"}
              id="bordered-radio-2"
              type="radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
              onChange={() => setProfile("walking")}
           />
           <label
              htmlFor="bordered-radio-2"
              className="w-full py-4 ms-4 text-sm font-medium text-gray-900 dark:text-gray-300"
           >
              Walking
           </label>
        </div>
        <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
           <input
              checked={profile === "cycling"}
              id="bordered-radio-2"
              type="radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
              onChange={() => setProfile("cycling")}
           />
           <label
              htmlFor="bordered-radio-2"
              className="w-full py-4 ms-4 text-sm font-medium text-gray-900 dark:text-gray-300"
           >
              Cycling
           </label>
        </div>
        <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
           <input
              checked={profile === "driving-traffic"}
              id="bordered-radio-2"
              type="radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
              onChange={() => setProfile("driving-traffic")}
           />
           <label
              htmlFor="bordered-radio-2"
              className="w-full py-4 ms-4 text-sm font-medium text-gray-900 dark:text-gray-300"
           >
              Driving-Traffic
           </label>
        </div>
     </>
  )
}

export default ProfileInput