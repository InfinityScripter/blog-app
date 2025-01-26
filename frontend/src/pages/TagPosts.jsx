import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { CommentsBlock, Post, TagsBlock } from '../components';
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByTag } from "../redux/slices/posts";

export const TagPosts = () => {
    const { tag } = useParams();
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.data);
    const { posts, tags } = useSelector(state => state.posts);
    const [sortBy, setSortBy] = useState('date');

    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';

    const handleSortChange = (event, newValue) => {
        setSortBy(newValue);
        dispatch(fetchPostsByTag({ tag, sort: newValue }));
    };

    useEffect(() => {
        dispatch(fetchPostsByTag({ tag, sort: sortBy }));
    }, [tag, dispatch, sortBy]);

    return (
        <>
            <div style={{ marginBottom: 15 }}>
                <h2>Посты по тегу: #{tag}</h2>
            </div>
            <Tabs
                style={{ marginBottom: 15 }}
                value={sortBy}
                onChange={handleSortChange}
                aria-label="sort options"
            >
                <Tab value="date" label="По дате" />
                <Tab value="views" label="По просмотрам" />
            </Tabs>
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
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: "Вася Пупкин",
                                    avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                                },
                                text: "Это тестовый комментарий",
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
