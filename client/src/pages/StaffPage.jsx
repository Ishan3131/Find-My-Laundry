import { useState } from "react"

import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar"
import BagBox from "../components/BagBox"

import LogoutIcon from "../assets/icons/log-out.svg"
import MoonIcon from "../assets/icons/moon.svg"
import SunIcon from "../assets/icons/sun.svg"

const laundryData = [
  {
    id: 1023,
    name: "Atul Panda",
    phone: "+91 76068 31663",
    token: "2501010200",
    status: "Pending",
  },
  {
    id: 1024,
    name: "Ishan Chetwani",
    phone: "+91 88171 27466",
    token: "2501010370",
    status: "Washed",
  },
  {
    id: 1025,
    name: "Param Malik",
    phone: "+91 95965 33065",
    token: "2501010560",
    status: "Done",
  },
]

function StaffPage() {

  const [isDark, setIsDark] = useState(false)

  return (
    <div
      className={`
        min-h-screen
        px-5
        pt-6
        pb-10
        transition-all duration-300

        ${isDark
          ? "bg-[#161616]"
          : "bg-[#f3f3f1]"
        }
      `}
    >

      <div className="max-w-lg mx-auto">

        {/* top */}

        <div className="flex justify-between items-start mb-6">

          <div>

            <h1
              className={`
                text-[34px]
                leading-none
                font-semibold
                tracking-tight

                ${isDark
                  ? "text-[#f5f5f5]"
                  : "text-[#2b2b2b]"
                }
              `}
            >
              Find My Laundry
            </h1>

            <p
              className={`
                mt-2
                text-sm

                ${isDark
                  ? "text-[#b0b0b0]"
                  : "text-[#8e8e8e]"
                }
              `}
            >
              Staff Dashboard
            </p>

          </div>

          <div className="flex items-center gap-3">

            {/* dark mode */}

            <button
              onClick={() => setIsDark(!isDark)}
              className={`
                w-12 h-12
                rounded-full
                border
                flex items-center justify-center

                ${isDark
                  ? "bg-[#202020] border-[#343434]"
                  : "bg-[#f7f7f5] border-[#d4d4d4]"
                }
              `}
            >

              <img
                src={isDark ? SunIcon : MoonIcon}
                alt="theme"
                className={`
                  w-5 h-5
                  ${isDark ? "invert" : ""}
                `}
              />

            </button>

            {/* logout */}

            <button
              className={`
                w-12 h-12
                rounded-full
                border
                flex items-center justify-center

                ${isDark
                  ? "bg-[#202020] border-[#343434]"
                  : "bg-[#f7f7f5] border-[#d4d4d4]"
                }
              `}
            >

              <img
                src={LogoutIcon}
                alt="logout"
                className={`
                  w-5 h-5
                  ${isDark ? "invert brightness-0" : ""}
                `}
              />

            </button>

          </div>

        </div>

        {/* navbar */}

        <Navbar isDark={isDark} />

        {/* search */}

        <div className="mt-5">
          <SearchBar isDark={isDark} />
        </div>

        {/* new bag */}

        <button
          className={`
            w-full
            mt-4
            py-4
            rounded-[22px]
            border
            text-[15px]
            transition-all

            ${isDark
              ? "bg-[#202020] border-[#343434] text-[#f5f5f5]"
              : "bg-[#f7f7f5] border-[#d5d5d5] text-[#2b2b2b]"
            }
          `}
        >
          + New Bag
        </button>

        {/* cards */}

        <div className="space-y-6 mt-7">

          {laundryData.map((bag) => (
            <BagBox
              key={bag.id}
              bag={bag}
              isDark={isDark}
            />
          ))}

        </div>

      </div>

    </div>
  )
}

export default StaffPage