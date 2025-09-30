import axios from "axios"
import { useEffect, useState } from "react"

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const AIPannel = (reponame) => {
    const [list, setlist] = useState([])

    useEffect(() => {
        const setting = async () => {
            const res = await axios.post(`${API_BASE}/api/ai/file`, {
                path: reponame.reponame
            })
            setlist(prevList => [...prevList, res.data.message]);
        }
        
        setting()
    }, [reponame])

    return (
        <div style={{ padding: "10px", width: "300px" }}>
            <h3>AI</h3>
            {list.map(value => (
                <p>{value}</p>
            ))}
        </div>
    )
}