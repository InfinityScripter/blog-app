import Container from "@mui/material/Container";
import {Route, Routes} from "react-router-dom";
import {Header} from "./components";
import {AddPost, FullPost, Home, Login, Registration} from "./pages";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthMe, selectIsAuth} from "./redux/slices/auth";
import {useEffect} from "react";
import {TagPosts} from "./pages/TagPosts";
import {EmailVerification} from "./pages/EmailVerification";
import {ForgotPassword} from "./pages/ForgotPassword";
import {ResetPassword} from "./pages/ResetPassword";
import {AuthSuccess} from "./pages/AuthSuccess";
import Cookies from 'js-cookie';

function App() {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            dispatch(fetchAuthMe());
        }
    }, [dispatch]);

    return (
        <>
            <Header/>
            <Container maxWidth="lg">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/posts/tag/:tag" element={<TagPosts/>}/>
                    <Route path="/posts/:id" element={<FullPost/>}/>
                    <Route path="/posts/create" element={<AddPost/>}/>
                    <Route path="/posts/:id/edit" element={<AddPost/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Registration/>}/>
                    <Route path="/verify-email/:token" element={<EmailVerification/>}/>
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/reset-password/:token" element={<ResetPassword/>}/>
                    <Route path="/auth/success" element={<AuthSuccess />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
