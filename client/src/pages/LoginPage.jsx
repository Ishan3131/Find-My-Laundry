function LoginPage(props) {

  return (

    <div
      className={`
        min-h-screen
        flex items-center justify-center
        px-5

        ${props.lightTheme
          ? 'bg-[#f3f3f1]'
          : 'bg-[#161616]'
        }
      `}
    >

      <div
        className={`
          w-full max-w-sm
          rounded-[34px]
          border
          p-6

          ${props.lightTheme
            ? 'bg-[#f7f7f5] border-[#d5d5d5]'
            : 'bg-[#202020] border-[#343434]'
          }
        `}
      >

        <h1
          className={`
            text-[34px]
            font-semibold

            ${props.lightTheme
              ? 'text-[#2b2b2b]'
              : 'text-white'
            }
          `}
        >
          Find My Laundry
        </h1>

        <p className='text-[#8e8e8e] mt-2 mb-7'>
          Staff Login
        </p>

        <div className='space-y-4'>

          <input
            type='text'
            placeholder='Username'
            className={`
              w-full
              rounded-[20px]
              border
              p-5
              outline-none

              ${props.lightTheme
                ? 'bg-white border-[#d5d5d5]'
                : 'bg-[#2a2a2a] border-[#343434] text-white'
              }
            `}
          />

          <input
            type='password'
            placeholder='Password'
            className={`
              w-full
              rounded-[20px]
              border
              p-5
              outline-none

              ${props.lightTheme
                ? 'bg-white border-[#d5d5d5]'
                : 'bg-[#2a2a2a] border-[#343434] text-white'
              }
            `}
          />

          <button className='w-full bg-[#2b2b2b] text-white rounded-[20px] p-5'>
            Login
          </button>

        </div>

      </div>

    </div>

  )
}

export default LoginPage