
import { useState } from "react";
import shoppingBag from "../assets/icons/shopping-bag.svg";
import MessageBox from "./MessageBox";
import axios from "axios";
import tick from "../assets/icons/tick.svg";
import cross from "../assets/icons/cross.svg";

let prevStatus = null
function Bags(props) {

  const [status, setStatus] = useState(props.status);
  const [statusChanged, setStatusChanged] = useState(false)
  const [popMessage, setPopMessage] = useState(false)
  const [messageBoxClass, setMessageBoxClass] = useState('')
  const [messageBoxText, setMessageBoxText] = useState('')
  const [isDeleted, setIsDeleted] = useState(false)

  async function updateStatus() {
    try {
      const token = localStorage.getItem('token');
      setPopMessage(true)
      setStatusChanged(false)
      setMessageBoxClass('text-blue-400')
      setMessageBoxText('Updating...')
      await axios.patch(`https://find-my-laundry.vercel.app/laundries/${props.id}`, {'status': status}, {'headers': {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}})
      setMessageBoxClass('text-lime-400')
      setMessageBoxText('Status Updated')
      setPopMessage(true)
      setTimeout(() => setPopMessage(false), 1500)
    }
    catch (err) {
      console.log(err)
      setStatus(prevStatus);
      setMessageBoxClass('text-red-400')
      setMessageBoxText('Request Failed')
      setPopMessage(true)
      setTimeout(() => setPopMessage(false), 1500)
    }
    setStatusChanged(false)
  }
  
  function abortStatusUpdate() {
    setStatus(prevStatus)
    setStatusChanged(false)
  }
  
  async function handleDeleteBag() {
    if(confirm('Are you sure?')) {
      try{
        const token = localStorage.getItem('token')
        setMessageBoxClass('text-blue-400')
        setMessageBoxText('Deleting...')
        setPopMessage(true)
        await axios.delete(`https://find-my-laundry.vercel.app/laundries/${props.id}`, {'headers': {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}})
        setIsDeleted(true)
        setMessageBoxText('Bag Removed')
        setMessageBoxClass('text-lime-400')
        setTimeout(() => setPopMessage(false), 1500)
      }
      catch (err) {
        console.log(err)
        setMessageBoxClass('text-red-400')
        setMessageBoxText('Request Failed')
        setPopMessage(true)
        setTimeout(() => setPopMessage(false), 1500)
      }
    }
  }

  return (

  <div
      className={`
        w-full
        border
        rounded-3xl

        px-3
        py-2

        mb-2

        shadow-sm

        transition-all
        duration-300
        ${isDeleted? 'hidden': 'static'}

        ${props.lightTheme

          ? "bg-white text-black border-zinc-200"

          : "bg-black text-white border-zinc-800"
        }

      `}
    >

      <div className="flex items-start justify-between">

        <div>

          <div
            className={`
              text-[10px]
              sm:text-xs

              ${props.lightTheme

                ? "text-gray-400"

                : "text-zinc-500"
              }
            `}
          >
            Bag ID
          </div>

          <div className="text-xl sm:text-2xl font-bold">
            #{props.id}
          </div>

        </div>


    <div className='flex flex-col items-center gap-5'>
          <div className='float flex gap-5'>

        {statusChanged && <button className='text-[20px]' onClick={updateStatus}>

          <img
  src={tick} alt="Confirm" className={`w-7 h-7 ${
    props.lightTheme ? "brightness-0" : "brightness-0 invert"
  }`}/>

        </button> 
        }
        {statusChanged && <button className='text-[20px]' onClick={abortStatusUpdate}>
          <img

  src={cross} alt="Confirm" className={`w-7 h-7 ${

    props.lightTheme ? "brightness-0" : "brightness-0 invert"
  }`}/>
  
        </button> }
        
        <select

          value={status}

          onChange={(e) => {
              prevStatus = props.status
              setStatus(e.target.value)
              setStatusChanged(true)
          }}

          className={`

            px-4
            py-3

            flex 

            items-center

            justify-center

            rounded-lg

            text-xs
            sm:text-sm

            outline-none

            cursor-pointer

            transition-all
            duration-300

           ${status === "Pending"

  ? "bg-[#FEF6E1] text-black"

  : status === "Washed"

  ? "bg-[#EEF3FF] text-black"

  : status === "Collected"

  ? "bg-[#e4ddeb] text-black"

  : "bg-[#EBF5EC] text-black"
}

          `}
        >

          <option value="Pending">
            Pending
          </option>

          <option value="Washed">
            Washed
          </option>

          <option value="Done">
            Done
          </option>

          <option value="Collected">
            Collected
          </option>

        </select>
    
      </div>
        </div>
      </div>



      <div className="flex items-center mt-3">

        <div
          className={`

            w-14
            h-14

            sm:w-16
            sm:h-16

            rounded-xl

            flex
            items-center
            justify-center

            ${status === "Pending"

              ? "bg-[#FEF6E1]"

              : status === "Washed"

              ? "bg-[#EEF3FF]"

              : status === "Collected"
              ? "bg-[#e4ddeb]"
              : "bg-[#EBF5EC]"

            }

          `}
        >

          <img
            src={shoppingBag}
            className="w-7 h-7 sm:w-8 sm:h-8"
            alt="shopping bag"
          />

        </div>



        <div className="ml-3 space-y-[2px]">

          <div className="text-base sm:text-lg font-semibold">
            {props.name}
          </div>

          <div
            className={`
              text-base
              sm:text-sm

              ${props.lightTheme

                ? "text-gray-600"

                : "text-zinc-400"
              }
            `}
          >
            {props.phone}
          </div>

  

        </div>
      </div>



    <div className="flex justify-between mt-2">
        <span
            className={`
              text-lg
              
              lg:text-1xl
              font-bold

              ${props.lightTheme

                ? "text-gray-600"

                : "text-zinc-400"
              }
            `}
          >
            {props.enrollment_id} 
          </span>


        <button
          onClick={handleDeleteBag}
          className={`

            text-xs
            sm:text-sm

            cursor-pointer

            transition-all
            duration-300

            hover:scale-105

            ${props.lightTheme

              ? "text-gray-400 hover:text-red-500"

              : "text-zinc-500 hover:text-red-400"
            }

          `}
        >
          🗑 Delete
        </button>

      </div>
    { popMessage && <MessageBox style={messageBoxClass} text={messageBoxText} lightTheme={props.lightTheme} /> }
    
    </div>

  )
}

export default Bags;
