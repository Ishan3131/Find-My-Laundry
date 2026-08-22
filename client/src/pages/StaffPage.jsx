import { useState, useEffect } from 'react'
import axios from 'axios'
import ToggleThemeButton from '../components/ToggleThemeButton'
import StaffBagBox from '../components/StaffBagBox'
import Search from '../components/Search'
import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar'
import AddBag from '../components/AddBag'

function StaffPage(props) {
    const navigate = useNavigate();
    const [staffSearchResult, setStaffSearchResult] = useState(null) // It stores user's search result's data
    const [loading, setLoading] = useState(false)
    const [searchMessage, setSearchMessage] = useState('')
    const [staffRenderedBags, setStaffRenderedBags] = useState([])
    const [bagsCount, setBagsCount] = useState(0)
    const [allBagsData, setAllBagsData] = useState([])
    const [addBagForm, setAddBagForm] = useState(false)
    const [newBag, setNewBag] = useState({id: '', name: '', phone: '', enrollment_id: '', status: 'Pending'})

    useEffect(() => {
        async function loadData() {
            const token = localStorage.getItem('token')
            if(token != null) {
                try {
                    setLoading(true)
                    const res = await axios.get(props.base+'/laundries', {'headers': {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}})
                    setStaffRenderedBags(res.data.laundries)
                    setAllBagsData(res.data.laundries)
                    setBagsCount(res.data.laundries.length)
                    setLoading(false)
                }
                catch (err) {
                    navigate('/login')
                }
            }
            else {
                navigate('/login')
            }
        }
        loadData()
    },[])

    async function handleStaffSearch(searchInputId) {
        if(searchInputId) {
            try {
                const token = localStorage.getItem('token')
                setSearchMessage('Searching...')
                const bag = await axios.get(props.base+`/laundries/${searchInputId}/details`, {'headers': {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}})
                setSearchMessage('')
                setStaffSearchResult(bag.data.laundry);
            }
            catch (err) {
                setSearchMessage('No bag found')
                console.log(err)
            }
        }
    }

    async function handleAddNewBag() {
        if(newBag.status.length > 0 && newBag.name.trim().length > 0 && newBag.phone.trim().length > 0 && newBag.enrollment_id.trim().length > 0) {
            try {
                const token = localStorage.getItem('token')
                await axios.post(props.base+`/laundries`, newBag, {'headers': {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}})
                setSearchMessage('New Bag Added')
                setTimeout(() => setSearchMessage(''), 2000)
                allBagsData.unshift(newBag)
                setAllBagsData(allBagsData)
                setStaffSearchResult(newBag)
                setBagsCount(bagsCount+1)
            }
            catch (err) {
                console.log(err)
                setSearchMessage('Request Failed')
                setTimeout(() => setSearchMessage(''), 2000)
            }
            finally {
                setAddBagForm(false);
            }
        }
        else {
            alert('invalid details...')
        }
    }

    return (
        <div
        className={`
        min-h-screen
        transition-colors
        duration-300
        pb-20
        ${props.lightTheme ? "bg-white text-black" : "bg-black text-white"}`
        }>

            <div
            className='pt-3 pl-3'>
                <ToggleThemeButton lightTheme={props.lightTheme} setLightTheme={props.setLightTheme} />
            </div>
            <br />

            <div>
                <Search handleSearch={handleStaffSearch} />
            </div>
            <h1 className='font-bold text-2xl m-3'>{searchMessage}</h1>

            {
            staffSearchResult != null && <StaffBagBox id={staffSearchResult.id} status={staffSearchResult.status} name={staffSearchResult.name} phone={staffSearchResult.phone} enrollment_id={staffSearchResult.enrollment_id} lightTheme={props.lightTheme} base={props.base} />
            }
            <hr className={`${props.lightTheme ? 'border-gray-600' : 'border-gray-400' }`}/>

            {loading && <h1 className='font-bold text-2xl m-3'>Loading...</h1>}
            <div className='flex justify-between p-2 items-center'>
                <h1 className='font-bold text-2xl m-3'>Bags Count: {bagsCount}</h1>
                <button className={`${props.lightTheme? 'bg-[#7eff61]' : 'bg-[#1c9600]'} h-fit w-fit px-3 py-1 font-bold rounded-[5px] ${props.lightTheme?'text-black': 'text-white'}`} onClick={() => setAddBagForm(true)}>New Bag</button>
            </div>
            <div
            className='flex flex-col gap-5'>
                {
                    staffRenderedBags.map(data => {
                        return <StaffBagBox key={data.id} id={data.id} status={data.status} name={data.name} phone={data.phone} enrollment_id={data.enrollment_id} lightTheme={props.lightTheme} base={props.base} />
                    })
                }
            </div>
        
            <div className='fixed bottom-0 w-full'>
                <Navbar lightTheme={props.lightTheme} setLightTheme={props.setLightTheme} allBagsData={allBagsData} setStaffRenderedBags={setStaffRenderedBags} setBagsCount={setBagsCount} />
            </div>
        {addBagForm && <AddBag lightTheme={props.lightTheme} handleAddBag={handleAddNewBag} setNewBag={setNewBag} newBag={newBag} setAddBagForm={setAddBagForm}  />}
        </div>
    )
}

export default StaffPage