import React from 'react';
import { Comment, Icon, Tooltip, Avatar } from 'antd';
import { getAuthUserInfo } from '../config/auth';
import TimeUtils from '../utils/time';

const MovieComment = (props) => {

    const { comment } = props;

    const currentUser = getAuthUserInfo();

    const liked = comment.likes.some(like => like == currentUser.id);

    const disliked = comment.dislikes.some(dislike => dislike == currentUser.id);

    const actions = [
        <span key="comment-basic-like">
          <Tooltip title="Like">
            <Icon
              type="like"
              theme={liked ? 'filled' : 'outlined'}
              onClick={props.onLike}
            />
          </Tooltip>
          <span style={{ paddingLeft: 8, cursor: 'auto' }}>{comment.likes.length}</span>
        </span>,

        <span key=' key="comment-basic-dislike"'>
          <Tooltip title="Dislike">
            <Icon
              type="dislike"
              theme={disliked ? 'filled' : 'outlined'}
              onClick={props.onDisLike}
            />
          </Tooltip>
          <span style={{ paddingLeft: 8, cursor: 'auto' }}>{comment.dislikes.length}</span>
        </span>,
        // <span key="comment-basic-reply-to">Reply to</span>,
      ];

    return (
        <Comment
            actions={actions}
            author={<a>{ comment.user.email }</a>}
            avatar={
            <Avatar
                src={ comment.user.avatar }
                alt={ comment.user.email }
            />
            }
        content={
          <p>
            { comment.content }  
          </p>
        }
        datetime={
          <Tooltip title={TimeUtils.getLocalTime(comment.createdAt)}>
            <span>{TimeUtils.getLocalTime(comment.createdAt)}</span>
          </Tooltip>
        }
      />
    );
};


export default MovieComment;
