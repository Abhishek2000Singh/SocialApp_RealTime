import './home.css'
import {Rightbar,Sidebar,Feed,Topbar} from "../../components/indexComp"



function Home() {
    return (
        <div>
            <Topbar />
            <div className="homeContainer">
                <Sidebar />
                <Feed />
                <Rightbar  />
            </div>
        </div>
    )
}

export default Home