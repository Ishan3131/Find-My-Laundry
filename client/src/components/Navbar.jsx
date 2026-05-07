import LayoutGridIcon from "../assets/icons/layout-grid.svg"
import ClockIcon from "../assets/icons/clock-3.svg"
import DropletsIcon from "../assets/icons/droplets.svg"
import CheckIcon from "../assets/icons/check-check.svg"
import ArchiveIcon from "../assets/icons/archive.svg"

const filters = [
  {
    name: "All",
    count: 24,
    icon: LayoutGridIcon,
  },
  {
    name: "Pending",
    count: 8,
    icon: ClockIcon,
  },
  {
    name: "Washed",
    count: 6,
    icon: DropletsIcon,
  },
  {
    name: "Done",
    count: 5,
    icon: CheckIcon,
  },
  {
    name: "Collected",
    count: 5,
    icon: ArchiveIcon,
  },
]

function Navbar({ isDark }) {
  return (
    <div className="overflow-x-auto">

      <div
        className={`
          flex
          w-max
          min-w-full
          rounded-[26px]
          overflow-hidden
          border

          ${isDark
            ? "bg-[#202020] border-[#343434]"
            : "bg-[#f7f7f5] border-[#d5d5d5]"
          }
        `}
      >

        {filters.map((item) => (
          <button
            key={item.name}
            className={`
              flex items-center gap-2
              px-5 py-4
              border-r
              last:border-r-0

              ${isDark
                ? "border-[#343434]"
                : "border-[#d5d5d5]"
              }
            `}
          >

            <img
              src={item.icon}
              alt={item.name}
              className={`
                w-5 h-5
                ${isDark ? "invert brightness-0" : ""}
              `}
            />

            <span
              className={`
                text-[15px]

                ${isDark
                  ? "text-[#f5f5f5]"
                  : "text-[#2b2b2b]"
                }
              `}
            >
              {item.name}
            </span>

            <span
              className={`
                text-[12px]

                ${isDark
                  ? "text-[#9f9f9f]"
                  : "text-[#8e8e8e]"
                }
              `}
            >
              {item.count}
            </span>

          </button>
        ))}

      </div>

    </div>
  )
}

export default Navbar