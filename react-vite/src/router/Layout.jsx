import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import { fetchCart } from "../redux/cart";
import { fetchFavorites } from "../redux/favorites";
import Navigation from "../components/Navigation/Navigation";

export default function Layout() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => {
      dispatch(fetchCart()); 
      setIsLoaded(true);
    });
  }, [dispatch]);


  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, sessionUser]);

  return (
    <ModalProvider>
      <Navigation />
      {isLoaded && <Outlet />}
      <Modal />
    </ModalProvider>
  );
}