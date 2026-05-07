import SearchIcon from "../assets/icons/search.svg"

function SearchBar({ isDark }) {
  return (
    <div className="relative">

      <input
        type="text"
        placeholder="Search Bag ID"
        className={`
          w-full
          rounded-[24px]
          py-5
          pl-16
          pr-20
          text-[16px]
          outline-none
          border

          ${isDark
            ? "bg-[#202020] border-[#343434] text-[#f5f5f5] placeholder:text-[#777]"
            : "bg-[#f7f7f5] border-[#d5d5d5] text-[#2b2b2b] placeholder:text-[#9a9a9a]"
          }
        `}
      />

      <img
        src={SearchIcon}
        alt="search"
        className={`
          w-6 h-6
          absolute
          left-5
          top-1/2
          -translate-y-1/2

          ${isDark ? "invert brightness-0" : ""}
        `}
      />

      <button
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          bg-[#2b2b2b]
          text-white
          px-4
          py-2
          rounded-[16px]
          text-sm
        "
      >
        Go
      </button>

    </div>
  )
}

export default SearchBar