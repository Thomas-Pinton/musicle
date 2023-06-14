const { useEffect, useState } = require("react");
import './dataPage.css';

let xImage = 'https://cdn2.iconfinder.com/data/icons/basic-4/512/close-512.png';

const AttemptValue = ({numberOfAttempts, amount, percentage}) => {
    console.log(percentage);
    return (
        <div className="attemptData">
            <div className="number">{numberOfAttempts}: {amount}</div>
            <div className="barWrapper">
                <div className='barAttempt' style={{width: (percentage * 100).toString() + '%'}}></div>
            </div>
        </div>
    )
}

const DataPage = () => {

    const [previousGamesData, setPreviousGamesData] = useState({attempts: [0, 0, 0, 0, 0], won: 0, lost: 0})
    const [biggestAttempt, setBiggestAttempt] = useState(1);
    const [popUpClosed, setPopUpClosed] = useState(false)

    useEffect( () => {
        let data = window.localStorage.getItem("PREVIOUS_GAMES_DATA");
        data = null
        setPreviousGamesData(data ? JSON.parse(data) : {attempts: [2, 4, 7, 5, 4], won: 5, lost: 2});
        if (data)
            setBiggestAttempt(Math.max(...data.amount))
        console.log('biggestattempt', biggestAttempt);
        console.log("teste", previousGamesData)
    }, [])

    useEffect( () => {
        setBiggestAttempt(Math.max(...previousGamesData.attempts))
    }, [previousGamesData])

    return (
        <div>
        {console.log('popUpClosed', popUpClosed)}
        {!popUpClosed && (
        <div className = 'background'>
            <div className="popUpBox">
                <button onClick={() => setPopUpClosed(true)}>
                    <img src={xImage} className='xImage'></img>
                </button>
                {console.log(previousGamesData.attempts[0], biggestAttempt)}
                <h1 className='title'>Stats</h1>
                <div className="attemptsDataWrapper">
                    <AttemptValue 
                        numberOfAttempts = {1}
                        amount={previousGamesData.attempts[0]}
                        percentage={previousGamesData.attempts[0] / biggestAttempt} 
                    />
                    <AttemptValue 
                        numberOfAttempts = {2}
                        amount={previousGamesData.attempts[1]}
                        percentage={previousGamesData.attempts[1] / biggestAttempt} 
                    />
                    <AttemptValue 
                        numberOfAttempts = {3}
                        amount={previousGamesData.attempts[2]}
                        percentage={previousGamesData.attempts[2] / biggestAttempt} 
                    />
                    <AttemptValue 
                        numberOfAttempts = {4}
                        amount={previousGamesData.attempts[3]}
                        percentage={previousGamesData.attempts[3] / biggestAttempt} 
                    />
                    <AttemptValue 
                        numberOfAttempts = {5}
                        amount={previousGamesData.attempts[4]}
                        percentage={previousGamesData.attempts[4] / biggestAttempt} 
                    />
                </div>
                <div className="winWrapper">
                    <div className="winOrLoss">{previousGamesData.won} <br/> Wins </div>
                    <div className="barGraph">
                        {console.log( Math.floor(previousGamesData.lost / (previousGamesData.won + previousGamesData.lost)*100).toString())}
                        {console.log( Math.floor(previousGamesData.won / (previousGamesData.won + previousGamesData.lost)*100).toString())}
                        <div 
                            className='wonBar'
                            style ={{
                                width: (previousGamesData.won / (previousGamesData.won + previousGamesData.lost) * 100).toString()  + '%',
                                // width: '25'  + '%',
                                height: '100%',
                                backgroundColor: '#4E6E5D',
                            }} >
                        </div>
                        <div 
                            style ={{
                                width: (previousGamesData.lost / (previousGamesData.won + previousGamesData.lost)*100).toString()  + '%',
                                height: '100%',
                                backgroundColor: 'white',
                            }}>
                        </div>
                    </div>
                    <div className="winOrLoss">{previousGamesData.lost} <br/> Losses</div>
                </div>
            </div>
        </div>
        )}
        </div>
    )
}

export default DataPage;