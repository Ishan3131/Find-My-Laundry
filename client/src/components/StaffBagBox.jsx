import { useState } from 'react'

import BagIcon from '../assets/icons/shopping-bag.svg'
import UserIcon from '../assets/icons/user-round.svg'
import PhoneIcon from '../assets/icons/phone.svg'
import TrashIcon from '../assets/icons/trash-2.svg'

function StaffBagBox(props) {

  const [status, setStatus] = useState(props.status)

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

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`
            px-5
            py-3
            rounded-[18px]
            border
            outline-none
            text-[16px]
            font-medium

            ${statusStyles[status].bg}
            ${statusStyles[status].text}
            ${statusStyles[status].border}
          `}
        >

          <option value='Pending'>Pending</option>
          <option value='Washed'>Washed</option>
          <option value='Done'>Done</option>
          <option value='Collected'>Collected</option>

        </select>

      </div>

      <div className='flex gap-5 mt-8'>

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

        <div className='flex-1'>

          <div className='flex items-center gap-3 mb-4'>

            <img
              src={UserIcon}
              alt='user'
              className={`
                w-5 h-5
                ${props.lightTheme ? '' : 'invert brightness-0'}
              `}
            />

            <p
              className={`
                text-[18px]

                ${props.lightTheme
                  ? 'text-[#2b2b2b]'
                  : 'text-white'
                }
              `}
            >
              {props.name}
            </p>

          </div>

          <div className='flex items-center gap-3 mb-4'>

            <img
              src={PhoneIcon}
              alt='phone'
              className={`
                w-5 h-5
                ${props.lightTheme ? '' : 'invert brightness-0'}
              `}
            />

            <p
              className={`
                text-[16px]

                ${props.lightTheme
                  ? 'text-[#2b2b2b]'
                  : 'text-[#dddddd]'
                }
              `}
            >
              {props.phone}
            </p>

          </div>

          <p
            className={`
              text-[15px]

              ${props.lightTheme
                ? 'text-[#777777]'
                : 'text-[#aaaaaa]'
              }
            `}
          >
            Token: {props.token}
          </p>

        </div>

      </div>

      <div className='flex justify-end mt-6'>

        <button
          className={`
            flex items-center gap-2
            text-[15px]

            ${props.lightTheme
              ? 'text-[#7d7d7d]'
              : 'text-[#b0b0b0]'
            }
          `}
        >

          <img
            src={TrashIcon}
            alt='delete'
            className={`
              w-4 h-4
              ${props.lightTheme ? '' : 'invert brightness-0'}
            `}
          />

          Delete

        </button>

      </div>

    </div>

  )
}

export default StaffBagBox