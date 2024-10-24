import React from 'react'
import './profile.css'
import { Topbar, Sidebar, Feed, Rightbar } from '../../components/indexComp';

export default function Profile() {
    return (
        <div>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img className='profileCoverImg' src="/assets/post/3.jpeg" alt="" />
                            <img className='profileUserImg' src="/assets/person/7.jpeg" alt="" />
                        </div>
                        <div className="profileInfo">
                            <h4 className='profileInfoName'>Abhishek Singh</h4>
                            <span className='profileInfoDesc'>Hello my Friends !</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed />
                        <Rightbar  profile/>
                    </div>
                </div>
            </div>
        </div>
    )
}
