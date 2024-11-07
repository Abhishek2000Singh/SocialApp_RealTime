import React, { useContext, useEffect, useState } from 'react';
import './rightbar.css';
import { Users } from '../../dummyData';
import Online from '../online/Online';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from '@mui/icons-material';

function Rightbar({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = useState([]);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(currentUser.following.includes(user?.id));
    const [loading, setLoading] = useState(true); // State to track loading of friends

    // Update the followed state when currentUser or user id changes
    useEffect(() => {
        setFollowed(currentUser.following.includes(user?.id));
    }, [currentUser, user?.id]);

    // Fetch the friends of the user
    useEffect(() => {
        const getFriends = async () => {
            try {
                setLoading(true); // Set loading state to true when fetching
                const friendList = await axios.get('/users/friends/' + user._id);
                setFriends(friendList.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
            } finally {
                setLoading(false); // Set loading to false once the data is fetched
            }
        };

        if (user) {
            getFriends();
        }
    }, [user]);

    // Handle follow/unfollow action
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            if (followed) {
                await axios.put("/users/" + user._id + "/unfollow", { userId: currentUser._id });
                dispatch({ type: "UNFOLLOW", payload: user._id });
            } else {
                await axios.put("/users/" + user._id + "/follow", { userId: currentUser._id });
                dispatch({ type: "FOLLOW", payload: user._id });
            }
        } catch (error) {
            console.log('Error during follow/unfollow:', error);
        }
        setFollowed(!followed);
    };

    // Home page right bar (for home view)
    const HomeRightbar = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img className="birthdayImg" src={`${PF}gift.png`} alt="" />
                    <span className="birthdayText">
                        <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
                    </span>
                </div>
                <img className="rightbarAd" src={`${PF}ad.png`} alt="" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {Users.map((u) => (
                        <Online key={u.id} user={u} />
                    ))}
                </ul>
            </>
        );
    };

    // Profile page right bar (for profile view)
    const ProfileRightbar = () => {
        return (
            <>
                {user.username !== currentUser.username && (
                    <button className="rightbarFollowButton" onClick={handleClick}>
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <Remove /> : <Add />}
                    </button>
                )}
                <h4 className="rightbarTitle">User Information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City</span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                </div>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                </div>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship</span>
                        <span className="rightbarInfoValue">
                            {user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}
                        </span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User Friends</h4>
                <div className="rightbarFollowings">
                    {loading ? (
                        <p>Loading friends...</p>
                    ) : friends.length === 0 ? (
                        <p>No friends to display</p>
                    ) : (
                        friends.map((friend) => (
                            <Link to={"/profile/" + friend.username} style={{ textDecoration: "none" }} key={friend._id}>
                                <div className="rightbarFollowing">
                                    <img
                                        className="rightbarFollowingImg"
                                        src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"}
                                        alt=""
                                    />
                                    <span className="rightbarFollowingName">{friend.username}</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    );
}

export default Rightbar;
