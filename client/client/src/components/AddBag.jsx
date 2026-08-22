function AddBag(props) {

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

      <div
        className={`

          w-full
          max-w-xs

          rounded-2xl

          p-4

          max-h-[90vh]
          overflow-y-auto

          shadow-xl

          transition-all
          duration-300

          ${props.lightTheme

            ? "bg-white text-black"

            : "bg-zinc-900 text-white"
          }

        `}
      >



        <div className="flex items-center justify-between mb-4">

          <div className="text-xl font-bold">
            Add New Bag
          </div>

          <button
            onClick={() => props.setAddBagForm(false)}
            className="text-lg cursor-pointer"
          >
            ✕
          </button>

        </div>



        <div className="space-y-3">

  

          <input
            id='id'
            type="text"
            placeholder="Bag Number"

            value={props.newBag.id}

            onChange={(e) =>
              props.setNewBag({
                ...props.newBag,
                id: e.target.value
              })
            }

            className={`

              w-full

              px-3
              py-2

              rounded-xl

              outline-none

              text-sm

              transition-all
              duration-300

              ${props.lightTheme

                ? "bg-gray-100"

                : "bg-zinc-800"
              }

            `}
          />



          <input
            type="text"
            id='name'
            placeholder="Name"

            value={props.newBag.name}

            onChange={(e) =>
              props.setNewBag({
                ...props.newBag,
                name: e.target.value
              })
            }

            className={`

              w-full

              px-3
              py-2

              rounded-xl

              outline-none

              text-sm

              transition-all
              duration-300

              ${props.lightTheme

                ? "bg-gray-100"

                : "bg-zinc-800"
              }

            `}
          />



          <input
            type="text"
            id='phone'
            placeholder="Phone Number"

            value={props.newBag.phone}

            onChange={(e) =>
              props.setNewBag({
                ...props.newBag,
                phone: e.target.value
              })
            }

            className={`

              w-full

              px-3
              py-2

              rounded-xl

              outline-none

              text-sm

              transition-all
              duration-300

              ${props.lightTheme

                ? "bg-gray-100"

                : "bg-zinc-800"
              }

            `}
          />


         

            
          <select
            id='status'
            value={props.newBag.status}

            onChange={(e) =>
              props.setNewBag({
                ...props.newBag,
                status: e.target.value
              })
            }

            className={`

              w-full

              px-3
              py-2

              rounded-xl

              outline-none

              text-sm

              transition-all
              duration-300

              ${props.lightTheme

                ? "bg-gray-100 text-black"

                : "bg-zinc-800 text-white"
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



        <div className="flex justify-end gap-2 mt-5">

          <button

            onClick={() => props.setAddBagForm(false)}

            className={`

              px-3
              py-2

              rounded-xl

              text-sm

              transition-all
              duration-300

              ${props.lightTheme

                ? "bg-gray-200 text-black"

                : "bg-zinc-700 text-white"
              }

            `}
          >
            Cancel
          </button>

          <button

            onClick={props.handleAddBag}

            className="
              px-3
              py-2

              rounded-xl

              text-sm

              bg-green-500
              text-white

              transition-all
              duration-300

              hover:scale-105
            "
          >
            Add Bag
          </button>

        </div>

      </div>

    </div>

  );
}

export default AddBag;