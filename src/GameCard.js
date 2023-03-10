import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GameCard({gameInfo}) {
    const [gameName, setGameName] = useState('')
    const [gameId, setGameId] = useState('')

    const navigate = useNavigate();


    useEffect(() => {
        setGameName(gameInfo.game_name)
        setGameId(gameInfo.game_id)
    }, [])

    const redirect = (gameId) => {
        const gameUrl = "/game/" + gameId
        navigate(gameUrl)
    }

    return (
        <div className="card-container">
            <div className="card-name">
                {gameName}
            </div>
            <div className="card-bottom">
                <button onClick={() => redirect(gameId)} >ViewGame</button>
            </div>
        </div>
    )
}