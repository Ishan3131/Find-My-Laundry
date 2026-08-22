import { useEffect, useState } from 'react'
import axios from 'axios'
import ToggleThemeButton from '../components/ToggleThemeButton'
import UserBagBox from '../components/UserBagBox'
import Search from '../components/Search'
function UserPage(props) {

    const [userRecentSearch, setUserRecentSearch] = useState([]) // It stores user's recent search results
    const [userSearchResult, setUserSearchResult] = useState(null) // It stores user's search result's data
    const [loading, setLoading] = useState(false)
    const [searchMessage, setSearchMessage] = useState('')

    useEffect(() => {
        // Loads recent search bag ids.
        async function load() {
            const recentSearch = JSON.parse(localStorage.getItem('userRecentSearch'))
            try {
                    if(recentSearch != null && recentSearch.length > 0) { 
                        setLoading(true)
                        const reqs = recentSearch.map(id => axios.get(`https://find-my-laundry.vercel.app/laundries/${id}`))
                        const res = await Promise.allSettled(reqs)
                        const bags = res.filter(result => result.status == 'fulfilled').map(res => res.value.data)
                        setUserRecentSearch(bags)
                        setLoading(false)
                    }
                    else {
                        localStorage.setItem('userRecentSearch', JSON.stringify([]))
                    }
                }
            catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        load()
    }, [])


    async function handleUserSearch(searchInputId) {
        if(searchInputId) {
            try {
                setSearchMessage('Searching...')
                const bag = await axios.get(`https://find-my-laundry.vercel.app/laundries/${searchInputId}`)
                console.log(bag)
                setSearchMessage('')
                setUserSearchResult(bag.data);
                const prevIds = JSON.parse(localStorage.getItem('userRecentSearch'))
                prevIds.unshift(searchInputId)
                for(let i=1;i<prevIds.length;i++) {
                    if(prevIds[i] == searchInputId) {
                        prevIds.splice(i,1)
                        break
                    }
                }
                if(userRecentSearch.length > 5) {
                    prevIds.pop()
                }
                setUserRecentSearch(userRecentSearch)
                localStorage.setItem('userRecentSearch', JSON.stringify(prevIds));
            }
            catch (err) {
                setSearchMessage('No bag found')
                console.log(err)
            }
        }
    }
    
    return (
        <div
        className={`
        min-h-screen
        transition-colors
        duration-300
        ${props.lightTheme ? "bg-white text-black" : "bg-black text-white"}
      `}>
            <div
            className='pt-3 pl-3'>
                <ToggleThemeButton lightTheme={props.lightTheme} setLightTheme={props.setLightTheme} />
            </div>
            <br />
            <div>
                <Search handleSearch={handleUserSearch} />
            </div>
            <h1 className='font-bold text-2xl m-3'>{searchMessage}</h1>
            {
            (userSearchResult != null) && <UserBagBox id={userSearchResult.laundry.id} status={userSearchResult.laundry.status} lightTheme={props.lightTheme} />
            }

            <hr className={`${props.lightTheme ? 'border-gray-600' : 'border-gray-400' }`}/>
            {userRecentSearch.length > 0 && <h1 className='font-bold text-2xl m-3'>Recently Searched</h1>}
            {loading && <h1 className='font-bold text-2xl m-3'>Loading...</h1>}
            <div
            className='flex flex-col gap-5'>
            {
                userRecentSearch.map((dataa,index) => {
                    return <UserBagBox key={index} id={dataa.laundry.id} status={dataa.laundry.status} lightTheme={props.lightTheme} />
                })
            }
            </div>
        </div>
    )
}

export default UserPage