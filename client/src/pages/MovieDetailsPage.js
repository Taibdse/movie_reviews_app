import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button, Rate } from 'antd';

import MovieService from '../services/movie.service';
import PageLayout from '../layouts/PageLayout';
import ValidationUtils from '../utils/validation';

import MySpinner from '../components/MySpinner';
import NotFound from '../components/NotFound';
import MovieComment from '../components/MovieComment';

import { MOVIE_NOTFOUND } from '../common/constants';

const { TextArea } = Input;


const MovieDetailsPage = (props) => {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [notfound, setNotfound] = useState(false);
    
    useEffect(() => {
        console.log(props);
        const { movieSlug } = props.match.params;
        getMovie(movieSlug);
    }, []);

    const getMovie = async (movieSlug) => {
        setIsLoading(true);
        try {
            const res = await MovieService.getMovieDetails(movieSlug);
            console.log(res);
            if(res.data.success && !ValidationUtils.isEmpty(res.data.data)){
                setMovie(res.data.data);
            } else {
                setNotfound(true);
            }
        } catch (error) {
            setNotfound(true);
        }
        setIsLoading(false);

    }

    const onSubmitComment = () => {

    }

    const handleRate = (value) => {
        console.log('rate ' + value + ' stars');
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
                            <p>{ ValidationUtils.isEmpty(movie.content) ? 'Chưa có mô tả nội dung cho phim này' : movie.content }</p>
                            <Row>
                                <Col span={15} style={{ marginBottom: '10px' }}>
                                    <h4>Đánh giá</h4>
                                    <Rate onChange={handleRate} count={10}/>   
                                </Col>
                                <Col span={18} >
                                    <TextArea placeholder="Bình luận" allowClear style={{ marginBottom: '10px' }} />
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
                            <h3>Đánh giá phim</h3>
                            <hr/>
                            { [1,2,3,4].map(item => <MovieComment/>) }
                        </Col>
                    </Row>
                </>
            )}
            {isLoading && <MySpinner/> }

            {(!isLoading && notfound) && <NotFound message={MOVIE_NOTFOUND} /> }
           
        </PageLayout>
    );
};


export default MovieDetailsPage;
