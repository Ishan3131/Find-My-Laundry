import search from "../assets/icons/search.svg";
import { useState } from "react";

function Search(props) {
    const [searchInput, setsearchInput] = useState('')
  return (

    <div>

      <div
        className="
          flex items-center justify-between

          border rounded-3xl

          px-4 py-3
        "
      >

        <div className="flex items-center gap-3">

          <img
            src={search}
            alt="search icon"
            className="w-8 h-8 bg-white px-0.5 py-0.5 rounded-3xl"
          />

          <input
            type="text"
            placeholder="Search Laundry bag number"
            onChange={e => setsearchInput(e.target.value)}
            value={searchInput}
            className="
              outline-none
              text-gray-600
              text-1.5xl
              w-[calc(90vw-62px)]
              "
          />

        </div>

        <div className="text-gray-500 text-sm">
          <button className="px-4 py-2 bg-[#363532] rounded-2xl text-amber-100 text-sm cursor-pointer" onClick={() => props.handleSearch(searchInput)}>Go</button>
        </div>

      </div>

    </div>

  );
}

export default Search;