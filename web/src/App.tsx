import React, { useEffect } from 'react';
import logo from './logo.svg';
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './page/Login/LoginPage';
import RegisterForm from './page/Login/RegisterForm';
import HomePage from './page/Home/HomePage';
import NavBar from './component/NavBar/LeftNavBar/NavBar';
import CheckEmailPage from './page/Login/CheckEmailPage';
import ConfirmEmailPage from './page/Login/ConfirmEmailPage';
import { useStore } from './store/Store';
import { UserDto } from './Model/User';
import LoadingComponent from './component/Loading/LoadingComponent';
import { observer } from 'mobx-react-lite';
import AccountBoard from './component/NavBar/AccountBoard/AccountBoard';
import UpperNavBar from './component/NavBar/UpperNavBar/UpperNavBar';
import DiscoverPage from './page/Discover/DiscoverPage';
import MatchPage from './page/Match/MatchPage';
import GptPage from './page/Gpt/GptPage';
import AccountPage from './page/Account/AccountPage';
import FacePage from './page/Face/FacePage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RatingInfo from './page/Rate/RatingInfo';
import RateButton from './component/button/RateButton';

function App() {
  const location = useLocation();
  const pathsWithoutNavBar = ['/', '/register', '/checkEmail', '/ConfirmEmail'];
  const includeNavBar = !pathsWithoutNavBar.includes(location.pathname);

  const store = useStore()
  const { commonStore, accountStore, connectionStore } = store
  const { token, setAppLoad, isAppLoaded, setNavigate, showNavBar } = commonStore;
  const { getUser, User, setRegInfo } = accountStore;
  const { joinChatRooms, initSignalRConnection } = connectionStore

  const navigate = useNavigate();

  useEffect(() => {
    console.log("fetched User Object")
    if (token) {
      getUser().then(async (user) => {
        await initSignalRConnection();

        if (user.roomIds != undefined) {
          await joinChatRooms(user.roomIds);
        }

        if (!user.emailConfirmed) {
          navigate("/checkEmail")
        }
        else if (!user.profileFilled) {
          setRegInfo(true)
        }
      })
        .finally(() => {
          setAppLoad()
        })
    }
    else {
      setAppLoad()
    }
  }, [token])

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  if (!isAppLoaded) {
    return <LoadingComponent />
  }
  const showToastMessage = () => {
    toast.success("Success Notification !");
  };

  return (

    <div className="flex h-screen">

      <RatingInfo />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ position: 'fixed', zIndex: 9999 }} // Fix the container to the window
      />
      {showNavBar && includeNavBar && <NavBar />}
      <div className={`${showNavBar ? "pl-[100px]" : ""} flex flex-col w-full flex-grow`}>
        {includeNavBar && <UpperNavBar />}
        <div className={` ${includeNavBar ? "mt-[40px]  " : ""} flex-grow bg-[#dedddc]`}>
          <Routes>
            <Route path="/" element={<LoginPage />}>
              <Route path="register" element={<RegisterForm />} />
              <Route path="checkEmail" element={<CheckEmailPage />} />
              <Route path="confirmEmail" element={<ConfirmEmailPage />} />

            </Route>

            <Route path="/home" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/gpt" element={<GptPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/face" element={<FacePage />} />
          </Routes>

        </div>
      </div>
      <RateButton />
    </div >

  )
}

export default observer(App)
