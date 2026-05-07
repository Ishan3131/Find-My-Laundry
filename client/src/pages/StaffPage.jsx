import SearchBar from '../components/SearchBar'
import Navbar from '../components/Navbar'
import StaffBagBox from '../components/StaffBagBox'

function StaffPage(props) {

  return (

    <div
      className={`
        min-h-screen
        px-5
        pt-6
        pb-32

        ${props.lightTheme
          ? 'bg-[#f3f3f1]'
          : 'bg-[#161616]'
        }
      `}
    >

      <div className='max-w-lg mx-auto'>

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

        <p className='text-[#8e8e8e] mt-2 mb-6'>
          Staff Dashboard
        </p>

        <SearchBar lightTheme={props.lightTheme} />

        <div className='space-y-6 mt-7'>

          <StaffBagBox
            id='1023'
            name='Param Malik'
            phone='+91 95965 33065'
            token='2501010560'
            status='Pending'
            lightTheme={props.lightTheme}
          />

          <StaffBagBox
            id='1024'
            name='Ishan Chetwani'
            phone='+91 88171 27466'
            token='2501010370'
            status='Washed'
            lightTheme={props.lightTheme}
          />

        </div>

      </div>

      <Navbar lightTheme={props.lightTheme} />

    </div>

  )
}

export default StaffPage