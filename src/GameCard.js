import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where} from 'firebase/firestore'
import { db } from './firebase-config'
import { Card } from 'antd'
import { Typography } from 'antd';


export default function GameCard({gameInfo}) {
    const [gameName, setGameName] = useState('')
    const [gameId, setGameId] = useState('')
    const [numInfoCollected, setNumInfoCollected] = useState(null)
    const { Text, Link } = Typography;


    const navigate = useNavigate();

    useEffect(() => {
        getNumCollectedInfo()
    }, [])

    useEffect(() => {
        setGameName(gameInfo.game_name)
        setGameId(gameInfo.game_id)
    }, [])

    const redirect = (gameId) => {
        const gameUrl = "/game/" + gameId
        navigate(gameUrl)
    }

    const getNumCollectedInfo = async() => {
        const infoCollectionRef = collection(db, 'collected_info')
        let data = await getDocs(query(infoCollectionRef, where("game_id", "==", gameInfo.game_id)));
        let numDocs = data.size;
        setNumInfoCollected(numDocs)
    }
    
    return (
            <div className="card-container">
                <Card title={gameName} hoverable={true} onClick={() => redirect(gameId)}>
                    <Text>Sign-Ups: {numInfoCollected}</Text>
                </Card>
            </div>
            
            
    )
}