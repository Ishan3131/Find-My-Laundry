import { useState } from "react";

import shoppingBag from "../assets/icons/shopping-bag.svg";

function UserBags(props) {

  return (

    <div
      className={`
        w-full

        border-2

        rounded-3xl

        px-3
        py-3

        mb-1

        transition-all
        duration-300

        ${
          props.lightTheme

            ? `

                bg-white
                border-white

                text-black

              `

            : `

                bg-black

                border-zinc-800

                text-white

              `
        }

      `}
    >



      <div className="flex items-start justify-between">



        <div>

          <div
            className={`
              text-xs

              ${
                props.lightTheme

                  ? "text-gray-500"

                  : "text-zinc-500"
              }
            `}
          >
            Bag ID
          </div>

          <div className="text-2xl font-bold">
            #{props.id}
          </div>

        </div>



        <div
  className={`

    px-4
    py-2

    rounded-xl

    text-sm

    transition-all
    duration-300

    font-medium

    ${
      props.status === "Pending"

        ? "bg-[#FEF6E1] text-[#D9A404]"

        : props.status === "Washed"

        ? "bg-[#EEF3FF] text-[#2F80ED]"

        : props.status === "Collected"

        ? "bg-[#eadff5] text-[#7b4bc4]"

        : "bg-[#EBF5EC] text-[#219653]"
    }

  `}
>

  {props.status}

</div>
      </div>

      

      <div className="flex items-center mt-1">

 

        <div
          className={`

            w-20
            h-20

            rounded-2xl

            flex
            items-center
            justify-center

            ${
              props.status === "Pending"

                ? "bg-[#FEF6E1]"

                : props.status === "Washed"

                ? "bg-[#EEF3FF]"

                : props.status === "Collected"

                ? "bg-[#eadff5]"

                : "bg-[#EBF5EC]"
            }

          `}
        >

          <img
            src={shoppingBag}
            className="w-10 h-7"
            alt="shopping bag"
          />

        </div>

 

        <div className="ml-5">


          <div className="text-xl font-semibold">
            {props.name}
          </div>



          <div
            className={`
              text-sm

              ${
                props.lightTheme

                  ? "text-gray-600"

                  : "text-zinc-400"
              }
            `}
          >
            {props.phone}
          </div>

    

          <div
            className={`
              text-sm

              ${
                props.lightTheme

                  ? "text-gray-600"

                  : "text-zinc-400"
              }
            `}
          >
            {props.orderId}
          </div>

        </div>

      </div>

    </div>

  );
}

export default UserBags;
