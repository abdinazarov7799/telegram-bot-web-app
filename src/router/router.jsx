import React, {Suspense, useEffect} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import HomePage from "../modules/Home/HomePage.jsx";
import {useTelegram} from "../hooks/useTelegram.jsx";

const Router = ({ ...rest }) => {
    const {tg} = useTelegram();
    useEffect(() => {
        tg.ready();
    }, [])
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
              path={"/:lang"}
              index
              element={<HomePage />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
