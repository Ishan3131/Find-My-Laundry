function LoginPage() {
  return (
    <div
      className="
        min-h-screen
        bg-[#f3f3f1]
        flex items-center justify-center
        px-5
      "
    >

      <div
        className="
          w-full max-w-sm
          bg-[#f7f7f5]
          border border-[#d5d5d5]
          rounded-[34px]
          p-6
        "
      >

        <h1 className="text-[34px] leading-none font-semibold">
          Find My Laundry
        </h1>

        <p className="text-[#8e8e8e] mt-3 mb-8">
          Staff Login
        </p>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            className="
              w-full
              bg-transparent
              border border-[#d5d5d5]
              rounded-[20px]
              p-5
              outline-none
              text-[15px]
            "
          />

          <input
            type="password"
            placeholder="Password"
            className="
              w-full
              bg-transparent
              border border-[#d5d5d5]
              rounded-[20px]
              p-5
              outline-none
              text-[15px]
            "
          />

          <button
            className="
              w-full
              bg-[#2b2b2b]
              text-white
              rounded-[20px]
              p-5
              mt-3
              text-[15px]
            "
          >
            Login
          </button>

        </div>

      </div>

    </div>
  )
}

export default LoginPage