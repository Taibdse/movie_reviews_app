import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Input, Button, Rate } from 'antd';

import { UserContext } from '../contexts/user.context';

import MovieService from '../services/movie.service';
import CommentService from '../services/comment.service';
import PageLayout from '../layouts/PageLayout';
import ValidationUtils from '../utils/validation';
import AlertUtils from '../utils/alert';

import MySpinner from '../components/MySpinner';
import NotFound from '../components/NotFound';
import MovieComment from '../components/MovieComment';

import { movieConstants, commentConstants } from '../common/constants';

import { getAuthUserInfo } from '../config/auth';

const { TextArea } = Input;

const MovieDetailsPage = (props) => {
    const [movie, setMovie] = useState({});
    const [isLoadingMovie, setIsLoadingMovie] = useState(false);
    const [notfound, setNotfound] = useState(false);
    const [rate, setRate] = useState({ stars: 0 });
    const [comment, setComment] = useState({ content: '' });
    const [comments, setComments] = useState([]);
    const [commentsPagination, setCommentsPagination] = useState({ page: 1, itemsPerPage: 10 });
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [canLoadMoreComments, setCanLoadMoreComments] = useState(true);
    const [totalComments, setTotalComments] = useState(0);
    const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false);

    const userContext = useContext(UserContext);

    const currentUser = getAuthUserInfo();
    
    useEffect(() => {
        console.log(userContext.user);
        const { movieSlug } = props.match.params;
        getMovie(movieSlug);
    }, []);

    const getUserRating = (movie) => {
        return movie.ratings.find(rate => rate.user == currentUser.id);
    }

    const getMovie = async (movieSlug) => {
        setIsLoadingMovie(true);
        try {
            const res = await MovieService.getMovieDetails(movieSlug);
            console.log(res);
            if(res.data.success && !ValidationUtils.isEmpty(res.data.data)){
                const newMovie = res.data.data;
                setMovie(newMovie);
                const { page, itemsPerPage } = commentsPagination;
                getComments({ movieId: newMovie._id, page, itemsPerPage });
                const foundRate = getUserRating(newMovie);
                if(foundRate) setRate({ ...rate, stars: foundRate.stars }); 
            } else {
                setNotfound(true);
            }
        } catch (error) {
            setNotfound(true);
        }
        setIsLoadingMovie(false);

    }

    const getComments = async ({ movieId, page, itemsPerPage }) => {
        setIsLoadingComments(true);
        try {
            const res = await CommentService.getCommentsByMovieId({ movieId, page, itemsPerPage });
            console.log(res.data);
            const { success, data } = res.data;
            if(success && data.data) {
                setTotalComments(data.totalItems);
                setComments(data.data);
                if(data.totalItems == data.data.length) setCanLoadMoreComments(false);
            } else {
                setCanLoadMoreComments(false);
                setComments([]);
            }
        } catch (error) {
            setComments([]);
            setCanLoadMoreComments(false);
        }
        setIsLoadingComments(false);
    }

    const onSubmitComment = async () => {
        if(!ValidationUtils.isValidStringLength(comment.content, 8, 10000)){
            return AlertUtils.showAlert({ type: 'error', title: commentConstants.content_error })
        }

        try {
            const res = await CommentService.addComment({ movieId: movie._id, content: comment.content });
            const { success, data } = res.data;
            if(success){
                setComment({ ...comment, content: '' })
                setCommentsPagination({ ...commentsPagination, page: 1 });
                getComments({ movieId: movie._id, page: 1, itemsPerPage: commentsPagination.itemsPerPage });
                AlertUtils.showAlert({ type: 'success', title: commentConstants.add_comment_success });
            }
        } catch (error) {
            
        }
    }

    const handleRate = async (value) => {
        try {
            const res = await MovieService.rateMovie({ stars: value, movieId: movie._id });
            const { success } = res.data;
            if(success){
                setRate({ ...rate, stars: value });
                AlertUtils.showAlert({ type: 'warning', title: 'Bạn vừa đánh giá phim ' + value + ' stars!' })
            }
        } catch (error) {
            
        }
    }

    const changeComment = (e) => {
        setComment({ ...comment, content: e.target.value });
    }

    const handleReact = async (type, comment) => {
        try {
            const res = await CommentService.react({ type, commentId: comment._id });
            const { success, data } = res.data;
            console.log(data);
            if(success){
                const newComments = comments.map(c => {
                    if(c._id == comment._id) return data; 
                    return c;
                });

                setComments(newComments);
                
            }
        } catch (error) {
            console.log(error);
        }
    } 

    const loadMoreComments = async () => {
        const { page, itemsPerPage } = commentsPagination;
        const { _id } = movie;
        console.log('load more');
        setIsLoadingMoreComments(true);
        try {
            const res = await CommentService.getCommentsByMovieId({ movieId: _id, page: page + 1, itemsPerPage });
            const { success, data } = res.data;
            if(success && data){
                console.log(data);

                const newComments = [...comments, ...data.data]
                setComments(newComments);
                setCommentsPagination({ ...commentsPagination, page: page + 1 })
                if(newComments.length >= data.totalItems) {
                    setCanLoadMoreComments(false);
                } else {
                    
                }
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoadingMoreComments(false);
    }

    return (
        <PageLayout>
            {!ValidationUtils.isEmpty(movie) && (
                <>
                    <Row>
                        <Col span={6} style={{ padding: 10 }}>
                            <img src={movie.image} className="img-fluid"/>
                        </Col>
                        <Col span={18} style={{ padding: 10 }}>
                            <h3>
                                { movie.title.vn }<br/>
                                <small>{ movie.title.en }</small>
                            </h3>
                            <p>{ ValidationUtils.isEmpty(movie.description) ? movieConstants.content_notfound : movie.description }</p>
                            <Row>
                                <Col span={15} style={{ marginBottom: '10px' }}>
                                    <h4>Đánh giá</h4>
                                    <Rate value={rate.stars} onChange={handleRate} count={10}/><br/>
                                    <small style={{ fontWeight: 'bold' }}>{rate.stars == 0 ? 'Bạn chưa chấm điểm phim này!' : `Bạn đã chấm phim này ${rate.stars} điểm` }</small>   
                                </Col>
                                <Col span={24} >
                                    <TextArea 
                                        value={comment.content}
                                        onChange={changeComment}
                                        placeholder="Bình luận" 
                                        rows={4}
                                        allowClear 
                                        style={{ marginBottom: '10px' }} />
                                    <Button onClick={onSubmitComment} type="primary" style={{ float: 'right' }}>
                                        Gửi
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row >
                        <Col span={6} style={{ padding: 10 }}>
                            <h3>Thông tin phim</h3>
                            <hr/>
                            <table style={{ width: '100%' }}>

                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td >
                                            <strong className="nowrap">Thể loại:</strong>
                                        </td>
                                        <td>{ movie.category.title }</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong className="nowrap">Đạo diễn:</strong>
                                        </td>
                                        <td>{ movie.info.directors }</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong className="nowrap">Diễn viên:</strong>
                                        </td>
                                        <td>{ movie.info.actors }</td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingRight: '15px' }}>
                                            <strong className="nowrap">Khởi chiếu:</strong>
                                        </td>
                                        <td>{ movie.info.start }</td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <strong className="nowrap">Thời lượng:</strong>
                                    </td>
                                    <td>{ movie.info.duration }</td>
                                </tr>
                                    <tr>
                                        <td>
                                            <strong className="nowrap">Link phim:</strong>
                                        </td>
                                        <td>
                                            <a href={movie.info.link} target="_blank">link</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col span={18} style={{ padding: 10 }}>
                            <h3>
                                Đánh giá phim{' '}
                                <small>({totalComments} đánh giá)</small>
                            </h3>
                            <hr/>
                            { (!isLoadingComments && comments.length > 0) && (
                                <div>
                                    {comments.map(comment => <MovieComment 
                                                        key={comment._id} 
                                                        comment={comment} 
                                                        onLike={() => handleReact('like', comment)}
                                                        onDisLike={() => handleReact('dislike', comment)}/>
                                    )}
                                   { canLoadMoreComments && ( <Button 
                                                        type="secondary" 
                                                        style={{ textAlign: "center" }} 
                                                        onClick={loadMoreComments}
                                                        loading={isLoadingMoreComments}
                                                        >Xem thêm</Button>) }
                                </div>
                            )}

                            { (isLoadingComments) && <MySpinner/> }

                            { (!isLoadingComments && comments.length == 0) && <NotFound message={commentConstants.no_comments_found} /> }
                        </Col>
                    </Row>
                </>
            )}
            {isLoadingMovie && <MySpinner/> }

            {(!isLoadingMovie && notfound) && <NotFound message={movieConstants.notfound} /> }
           
        </PageLayout>
    );
};


export default MovieDetailsPage;
