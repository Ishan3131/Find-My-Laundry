import { useEffect, useState } from 'react'
function UserPage(props) {

    const [userRecentSearch, setUserRecentSearch] = useState(null) // It stores user's recent search results
    const [userSearchResult, setUserSearchResult] = useState(null) // It stores user's search result's data

    useEffect(() => {
        // Loads recent search bag ids.
        const recentSearch = JSON.parse(localStorage.getItem('userRecentSearch'))
        const prevData = []
        if(recentSearch != null && recentSearch.length > 0) { 
            recentSearch.forEach(async (id) => {
                try{
                    prevData.push(await axios.get(`https://find-my-laundry.vercel.app/laundries/${id}`));
                }
                catch (err) {
                    console.log(err)
                }
            })
        }
        else {
            localStorage.setItem('userRecentSearch', JSON.stringify([]))
        }
        setUserRecentSearch(prevData)
    }, [])


    async function handleUserSearch(searchInputId) {
        try {
            const bag = axios.get(`https://find-my-laundry.vercel.app/laundries/${searchInputId}`)
            setUserSearchResult(bag.data);
            userRecentSearch.unshift(bag.data)
            const prevIds = JSON.parse(localStorage.getItem('userRecentSearch'))
            prevIds.unshift(searchInputId)
            if(userRecentSearch.length > 5) {
                userRecentSearch.pop()
                prevIds.pop()
            }
            setUserRecentSearch(userRecentSearch)
            localStorage.setItem('userRecentSearch', JSON.stringify(prevIds));
        }
        catch (err) {
            console.log(err)
        }
    }

    function toggleTheme() {
        props.setLightTheme(!lightTheme)
    }
    
    return (
        <div>User Page</div>
    )
}

export default UserPage