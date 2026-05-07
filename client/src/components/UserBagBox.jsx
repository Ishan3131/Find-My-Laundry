import BagIcon from '../assets/icons/shopping-bag.svg'

function UserBagBox(props) {

  const statusStyles = {

    Pending: {
      bg: 'bg-[#efe5d2]',
      text: 'text-[#d49b00]',
      border: 'border-[#e0bf65]',
    },

    Washed: {
      bg: 'bg-[#dde5f2]',
      text: 'text-[#2d6fff]',
      border: 'border-[#7aa2ff]',
    },

    Done: {
      bg: 'bg-[#dde8de]',
      text: 'text-[#1f8a3d]',
      border: 'border-[#7db68e]',
    },

    Collected: {
      bg: 'bg-[#eadff5]',
      text: 'text-[#7b4bc4]',
      border: 'border-[#b193da]',
    },

  }

  return (

    <div
      className={`
        rounded-[34px]
        border
        p-5

        ${props.lightTheme
          ? 'bg-[#f7f7f5] border-[#d6d6d6]'
          : 'bg-[#202020] border-[#343434]'
        }
      `}
    >

      {/* top */}

      <div className='flex justify-between items-start'>

        <div>

          <p
            className={`
              text-sm mb-1

              ${props.lightTheme
                ? 'text-[#8f8f8f]'
                : 'text-[#aaaaaa]'
              }
            `}
          >
            Bag ID
          </p>

          <h2
            className={`
              text-[26px]
              font-semibold

              ${props.lightTheme
                ? 'text-[#2b2b2b]'
                : 'text-white'
              }
            `}
          >
            #{props.id}
          </h2>

        </div>

        {/* status */}

        <div
          className={`
            px-5
            py-3
            rounded-[18px]
            border
            text-[16px]
            font-medium

            ${statusStyles[props.status].bg}
            ${statusStyles[props.status].text}
            ${statusStyles[props.status].border}
          `}
        >
          {props.status}
        </div>

      </div>

      {/* content */}

      <div className='flex gap-5 mt-8'>

        {/* bag icon */}

        <div
          className={`
            min-w-[92px]
            h-[92px]
            rounded-[26px]
            flex items-center justify-center

            ${props.lightTheme
              ? 'bg-[#ece7df]'
              : 'bg-[#2b2b2b]'
            }
          `}
        >

          <img
            src={BagIcon}
            alt='bag'
            className={`
              w-11 h-11
              ${props.lightTheme ? '' : 'invert brightness-0'}
            `}
          />

        </div>

        {/* token */}

        <div className='flex flex-col justify-center'>

          <p
            className={`
              text-sm mb-2

              ${props.lightTheme
                ? 'text-[#8f8f8f]'
                : 'text-[#aaaaaa]'
              }
            `}
          >
            Laundry Token
          </p>

          <p
            className={`
              text-[22px]
              font-medium

              ${props.lightTheme
                ? 'text-[#2b2b2b]'
                : 'text-white'
              }
            `}
          >
            {props.token}
          </p>

        </div>

      </div>

    </div>

  )
}

export default UserBagBox