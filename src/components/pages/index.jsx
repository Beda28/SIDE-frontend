// import axios from 'axios';

export const IndexPage = () => {
    const test = async () => {
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=Ov23limQZTQt3j86hYyf`)
    }

    // const look = async () => {
    //     const res = await axios.get('http://localhost:4184/api/user/getid', {withCredentials: true})
    //     console.log(res.data)
    // }

    return<>
        <button onClick={() => {test()}}>버튼 누르기</button>
        {/* <button onClick={() => {look()}}>로그인한 계정보기</button> */}
    </>
}