import React from 'react';
import './feed.css'
import { Share, Post } from '../../components/indexComp';
import { Posts } from '../../dummyData'

function Feed() {
    return (
        <div className='feed'>
            <div className="feedWrapper">
                <Share />
                {Posts.map((p)=>(
                    <Post key={p.id} post={p} />
                ))}
                

            </div>
        </div>
    );
}

export default Feed;
