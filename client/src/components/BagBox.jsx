import UserIcon from "../assets/icons/user-round.svg"
import PhoneIcon from "../assets/icons/phone.svg"
import CircleIcon from "../assets/icons/circle.svg"
import ChevronIcon from "../assets/icons/chevron-down.svg"
import TrashIcon from "../assets/icons/trash-2.svg"
import BagIcon from "../assets/icons/shopping-bag.svg"

function BagBox({ bag, isDark }) {

  const statusStyles = {
    Pending: "bg-[#efe5d2] text-[#d49b00]",
    Washed: "bg-[#dde5f2] text-[#1f6fff]",
    Done: "bg-[#dde8de] text-[#1f8a3d]",
    Collected: "bg-[#e6def2] text-[#7448b9]",
  }

  const cardTint = {
    Pending: "bg-[#efe9da]",
    Washed: "bg-[#e4eaf4]",
    Done: "bg-[#e2e8e2]",
    Collected: "bg-[#e8e2f0]",
  }

  return (
    <div
      className={`
        rounded-[34px]
        p-5
        border

        ${isDark
          ? "bg-[#202020] border-[#343434]"
          : "bg-[#f7f7f5] border-[#d4d4d4]"
        }
      `}
    >

      {/* top */}

      <div className="flex justify-between items-start">

        <div>

          <p
            className={`
              text-sm mb-1

              ${isDark
                ? "text-[#8f8f8f]"
                : "text-[#9a9a9a]"
              }
            `}
          >
            Bag ID
          </p>

          <h2
            className={`
              text-[24px]
              font-semibold
              tracking-tight

              ${isDark
                ? "text-[#f5f5f5]"
                : "text-[#2b2b2b]"
              }
            `}
          >
            #{bag.id}
          </h2>

        </div>

        <div className="flex items-center gap-3">

          <div
            className={`
              flex items-center gap-2
              px-5 py-3
              rounded-[16px]
              text-[15px]
              ${statusStyles[bag.status]}
            `}
          >

            <div className="w-3 h-3 rounded-full bg-current"></div>

            {bag.status}

          </div>

          <button
            className={`
              w-11 h-11
              rounded-[14px]
              border
              flex items-center justify-center

              ${isDark
                ? "border-[#4a4a4a]"
                : "border-[#d5d5d5]"
              }
            `}
          >

            <img
              src={ChevronIcon}
              alt="dropdown"
              className={`
                w-5 h-5
                ${isDark ? "invert brightness-0" : ""}
              `}
            />

          </button>

        </div>

      </div>

      {/* middle */}

      <div className="flex gap-5 mt-6">

        {/* bag icon */}

        <div
          className={`
            min-w-[90px]
            h-[90px]
            rounded-[24px]
            border border-[#cfcfcf]
            flex items-center justify-center
            ${cardTint[bag.status]}
          `}
        >

          <img
            src={BagIcon}
            alt="bag"
            className={`
              w-11 h-11
              ${isDark ? "invert brightness-0" : ""}
            `}
          />

        </div>

        {/* content */}

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-4">

            <img
              src={UserIcon}
              alt="user"
              className={`
                w-5 h-5 opacity-70
                ${isDark ? "invert brightness-0" : ""}
              `}
            />

            <p
              className={`
                text-[18px]

                ${isDark
                  ? "text-[#f5f5f5]"
                  : "text-[#2b2b2b]"
                }
              `}
            >
              {bag.name}
            </p>

          </div>

          <div className="flex items-center gap-3 mb-4">

            <img
              src={PhoneIcon}
              alt="phone"
              className={`
                w-5 h-5 opacity-70
                ${isDark ? "invert brightness-0" : ""}
              `}
            />

            <p
              className={`
                text-[16px]

                ${isDark
                  ? "text-[#d0d0d0]"
                  : "text-[#2b2b2b]"
                }
              `}
            >
              {bag.phone}
            </p>

          </div>

          <div className="flex items-center gap-3">

            <img
              src={CircleIcon}
              alt="token"
              className={`
                w-5 h-5 opacity-50
                ${isDark ? "invert brightness-0" : ""}
              `}
            />

            <p
              className={`
                text-[16px]

                ${isDark
                  ? "text-[#bdbdbd]"
                  : "text-[#2b2b2b]"
                }
              `}
            >
              {bag.token}
            </p>

          </div>

        </div>

      </div>

      {/* delete */}

      <div className="flex justify-end mt-6">

        <button
          className={`
            flex items-center gap-2
            active:scale-95
            transition-all

            ${isDark
              ? "text-[#9f9f9f]"
              : "text-[#8f8f8f]"
            }
          `}
        >

          <img
            src={TrashIcon}
            alt="delete"
            className={`
              w-4 h-4 opacity-70
              ${isDark ? "invert brightness-0" : ""}
            `}
          />

          <span className="text-[14px]">
            Delete
          </span>

        </button>

      </div>

    </div>
  )
}

export default BagBox