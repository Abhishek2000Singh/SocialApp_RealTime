import React, { useContext, useEffect, useState } from 'react';
import './feed.css'
import { Share, Post } from '../../components/indexComp';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
// import { Posts } from '../../dummyData';

function Feed({ username }) {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext)
    useEffect(() => {

        // fetchPosts();
        const fetchPost = async () => {
            try {
                const res = username ? await axios.get("/posts/profile/" + username) : await axios.get("posts/timeline/" + user._id)
                setPosts(res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                }));

            } catch (error) {
                console.log(error);
            }

        };
        fetchPost();
    }, [username, user._id])
    return (
        <div className='feed'>
            <div className="feedWrapper">
                {(!username || username=== user.username) && <Share />}
                {posts.map((p) => (
                    <Post key={p._id} post={p} />
                ))}
            </div>
        </div>
    );
}

export default Feed;
