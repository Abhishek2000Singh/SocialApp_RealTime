import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';
import { Topbar, Sidebar, Feed, Rightbar } from '../../components/indexComp';
import { useParams } from 'react-router';


export default function Profile() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = useState({});
    const username = useParams().username
    // console.log(username);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/users?username=${username}`);
                setUser(res.data);
                console.log(res.data);

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        console.log(fetchUser());


    }, [username]);

    return (
        <div>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img
                                className="profileCoverImg"
                                src={
                                    user.coverPicture
                                        ? PF + user.coverPicture
                                        : PF + "person/noCover.png"
                                }
                                alt=""
                            />
                            <img
                                className="profileUserImg"
                                src={
                                    user.profilePicture
                                        ? PF + user.profilePicture
                                        : PF + "person/noAvatar.png"
                                }
                                alt=""
                            />
                        </div>
                        <div className="profileInfo">
                            <h4 className='profileInfoName'>{user.username}</h4>
                            <span className='profileInfoDesc'>{user.desc}</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username} />
                        <Rightbar user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}
