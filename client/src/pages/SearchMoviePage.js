import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Select, Card, Pagination } from 'antd';

import PageLayout from '../layouts/PageLayout';
import CategoryService from '../services/category.service';
import MovieService from '../services/movie.service';

import MySpinner from '../components/MySpinner';
import NotFound from '../components/NotFound';

import { MOVIE_NOTFOUND } from '../common/constants';

const { Option } = Select;
const { Meta } = Card;

let timeout = null;

const SearchMoviePage = (props) => {

    const [categories, setCategories] = useState([]);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({ keyword: '', category: 'all', page: 1, itemsPerPage: 12,  });

    

    useEffect(() => {
        getCategories();
        searchMovies();
    }, []);


    const getCategories = async () => {
        const res = await CategoryService.getAll();
        setCategories(res.data.data);
    }

    const searchMovies = async () => {
        setIsLoading(true);
        try {
            const res = await MovieService.getMovies(filters);
            const { data, totalItems } = res.data.data;
        
            setMovies(data);
            setTotalPages(Math.ceil(totalItems/filters.itemsPerPage));
        } catch (error) {
            setMovies([]);
            setTotalPages(0);
        }
        setIsLoading(false);
    }

    const changeFilters = async (value, name) => {
        const newFilters = { ...filters, [name]: value };
        if(name == 'category' || name == 'keyword') newFilters.page = 1;
        setFilters(newFilters);
        if(name = 'keyword') {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(searchMovies, 300);
        }
    }

    const viewDetails = (movie) => {
        props.history.push('/movie-details/' + movie.slug);
    }

    return (
        <PageLayout>
            <h2>Tất cả phim</h2>
            <hr/>
            <div>
                <Row>
                    <Col span={4} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                        <Input placeholder="Tìm tên phim..." onChange={(e) => changeFilters(e.target.value, 'keyword')}/>
                    </Col>
                    <Col span={6} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                        <Row>
                            <Col span={6} style={{ paddingTop: '4px' }}>
                                Thể loại
                            </Col>
                            <Col span={14}>
                                <Select value={filters.category} onChange={(value) => changeFilters(value, 'category')} style={{ width: '100%' }}>
                                    <Option value="all">Tất cả</Option>
                                    { categories.map(cate => (
                                        <Option key={cate._id} value={cate._id}>{ cate.title }</Option>
                                    )) }
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                { isLoading &&  <MySpinner/>}

                { !isLoading && (
                    <Row style={{ marginTop: '20px' }}>
                        { movies.map(movie => (
                            <Col span={5} style={{ padding: '6px' }} key={movie._id}>
                                <Card
                                    onClick={() => viewDetails(movie)}
                                    hoverable
                                    style={{ width: '100%' }}
                                    cover={<img alt={ movie.title.vn } src={ movie.image } />}
                                >
                                    <Meta title={ movie.title.vn } description={ movie.title.en } />
                                    {/* <h4>{ movie.title.vn }</h4> */}
                                </Card>
                            </Col>
                            ))
                        }
                    </Row>
               ) }

                { (!isLoading && movies.length > 0) && (
                    <Row>
                        <Pagination 
                            showQuickJumper defaultCurrent={filters.page} 
                            total={totalPages} 
                            onChange={(pageNumber) => changeFilters(pageNumber, 'page')} />
                    </Row>
                ) }

                {(!isLoading && movies.length == 0) && <NotFound message={MOVIE_NOTFOUND} />}
                
            </div>
        </PageLayout>
    );
};


export default SearchMoviePage;
