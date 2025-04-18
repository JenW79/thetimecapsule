import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import { fetchCart } from "../redux/cart";
import { fetchFavorites } from "../redux/favorites"
import Navigation from "../components/Navigation/Navigation";


export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => {
      dispatch(fetchCart());
      if (sessionUser) {
        dispatch(fetchFavorites());
      }
      setIsLoaded(true);
    });
  }, [dispatch, sessionUser]);
  return (
    <>
      <ModalProvider>
        <Navigation />
        {isLoaded && <Outlet />}
        <Modal />
      </ModalProvider>
    </>
  );
}