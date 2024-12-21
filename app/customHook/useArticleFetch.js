import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getArticleData } from '../store/getPostSlice';
import service from '../appwrite/config';

const useArticleFetch = (slug) => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const posts = await service.getPost(slug);
                if (posts) {
                    dispatch(getArticleData(posts));
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchData();
    }, [dispatch]);
};

export default useArticleFetch;
