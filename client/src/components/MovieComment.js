import React from 'react';
import { Comment, Icon, Tooltip, Avatar } from 'antd';

const MovieComment = (props) => {

    const like = () => {};
    const dislike = () => {};
    const action = 'like';
    
    const actions = [
        <span key="comment-basic-like">
          <Tooltip title="Like">
            <Icon
              type="like"
              theme={action === 'liked' ? 'filled' : 'outlined'}
              onClick={like}
            />
          </Tooltip>
          <span style={{ paddingLeft: 8, cursor: 'auto' }}>{'2'}</span>
        </span>,

        <span key=' key="comment-basic-dislike"'>
          <Tooltip title="Dislike">
            <Icon
              type="dislike"
              theme={action === 'disliked' ? 'filled' : 'outlined'}
              onClick={dislike}
            />
          </Tooltip>
          <span style={{ paddingLeft: 8, cursor: 'auto' }}>{'2'}</span>
        </span>,
        // <span key="comment-basic-reply-to">Reply to</span>,
      ];

    return (
        <Comment
            actions={actions}
            author={<a>Han Solo</a>}
            avatar={
            <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
            />
            }
        content={
          <p>
            We supply a series of design principles, practical patterns and high quality design
            resources (Sketch and Axure), to help people create their product prototypes beautifully
            and efficiently.
          </p>
        }
        datetime={
          <Tooltip title={'20/02/2020'}>
            <span>{'20/02/2020'}</span>
          </Tooltip>
        }
      />
    );
};


export default MovieComment;
