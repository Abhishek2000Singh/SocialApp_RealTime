import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import './post.css'

import { MoreVert } from '@mui/icons-material'
import { format } from "timeago.js"
import { AuthContext } from '../../context/AuthContext';
// import { Users } from '../../dummyData'

export default function Post({ post }) {

    const [like, setLike] = useState(post.likes.length);
    const [isliked, setIsLiked] = useState(false);
    // const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});
    const { user: currentUser } = useContext(AuthContext)

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id))
    }, [currentUser._id, post.likes])

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const likeHandler = async () => {
        try {
            await axios.put("/posts/" + post._id + "/like", { userId: currentUser._id })
        } catch (error) {

        }
        setLike(isliked ? like - 1 : like + 1);
        setIsLiked(!isliked)
    }
    useEffect(() => {
        // fetchUsers();
        const fetchUser = async () => {

            const res = await axios.get(`/users?userId=${post.userId}`)
            setUser(res.data);
            console.log(res.data);

        }
        fetchUser()
    }, [post.userId])

    return (
        <div className='post'>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                            <img className='postProfileImg' src={user && user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="" />
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img className='postImg' src={PF + post.img} alt="" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className='likeIcon' src={`${PF}like.png `} onClick={likeHandler} alt="" />
                        <img className='likeIcon' src={`${PF}heart.png `} onClick={likeHandler} alt="" />
                        <span className="postLikeCounter">{like}likes</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">
                            {post.comment}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
