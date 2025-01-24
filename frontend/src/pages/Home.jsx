import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { CommentsBlock, Post, TagsBlock } from '../components';
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags, fetchPostsByTag } from "../redux/slices/posts";

export const Home = () => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.data);
    const { posts, tags } = useSelector(state => state.posts);
    const [activeTab, setActiveTab] = useState(0);
    const [activeTag, setActiveTag] = useState(null);

    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setActiveTag(null);
    };

    const handleTagClick = (tag) => {
        setActiveTag(tag);
        dispatch(fetchPostsByTag(tag));
    };

    // Обновляем посты при смене вкладки
    useEffect(() => {
        if (!activeTag) {
            dispatch(fetchPosts(activeTab === 0 ? 'date' : 'views'));
        }
    }, [activeTab]);

    // Загружаем теги только один раз
    useEffect(() => {
        dispatch(fetchTags());
    }, []);

    return (
        <>
            <Tabs
                style={{ marginBottom: 15 }}
                value={activeTab}
                onChange={handleTabChange}
                aria-label="basic tabs example"
            >
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>
            {activeTag && (
                <div style={{ marginBottom: 15 }}>
                    <h2>Посты по тегу: #{activeTag}</h2>
                </div>
            )}
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    {(isPostsLoading ? Array.from({ length: 5 }) : posts.items).map((obj, index) =>
                        isPostsLoading ? (
                            <Post key={index} isLoading={true} />
                        ) : (
                            <Post
                                key={obj._id}
                                {...obj}
                                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
                                isEditable={userData?._id === obj.user._id}
                            />
                        )
                    )}
                </Grid>
                <Grid item xs={4}>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} onTagClick={handleTagClick} />
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: 'Вася Пупкин',
                                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                                },
                                text: 'Это тестовый комментарий',
                            },
                            {
                                user: {
                                    fullName: 'Иван Иванов',
                                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                                },
                                text: 'Комментарий на три строки...',
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
