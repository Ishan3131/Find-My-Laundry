import LayoutGridIcon from '../assets/icons/layout-grid.svg'
import ClockIcon from '../assets/icons/clock-3.svg'
import DropletsIcon from '../assets/icons/droplets.svg'
import CheckIcon from '../assets/icons/check-check.svg'
import ArchiveIcon from '../assets/icons/archive.svg'

const filters = [
  {
    name: 'All',
    count: 24,
    icon: LayoutGridIcon,
  },
  {
    name: 'Pending',
    count: 8,
    icon: ClockIcon,
  },
  {
    name: 'Washed',
    count: 6,
    icon: DropletsIcon,
  },
  {
    name: 'Done',
    count: 5,
    icon: CheckIcon,
  },
  {
    name: 'Collected',
    count: 5,
    icon: ArchiveIcon,
  },
]

function Navbar(props) {

  return (

    <div
      className={`
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        w-[95%]
        max-w-lg
        rounded-[26px]
        border
        overflow-hidden
        z-50

        ${props.lightTheme
          ? 'bg-[#f7f7f5] border-[#d5d5d5]'
          : 'bg-[#202020] border-[#343434]'
        }
      `}
    >

      <div className='flex overflow-x-auto'>

        {filters.map((item) => (

          <button
            key={item.name}
            className={`
              flex flex-col items-center justify-center
              min-w-[78px]
              py-3
              border-r
              last:border-r-0

              ${props.lightTheme
                ? 'border-[#d5d5d5]'
                : 'border-[#343434]'
              }
            `}
          >

            <img
              src={item.icon}
              alt={item.name}
              className={`
                w-5 h-5 mb-1
                ${props.lightTheme ? '' : 'invert brightness-0'}
              `}
            />

            <p
              className={`
                text-[13px]

                ${props.lightTheme
                  ? 'text-[#2b2b2b]'
                  : 'text-white'
                }
              `}
            >
              {item.name}
            </p>

            <p className='text-[11px] text-[#8e8e8e]'>
              {item.count}
            </p>

          </button>

        ))}

      </div>

    </div>

  )
}

export default Navbar