import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const UserBoard = lazy(() => import("./Pages/UserBoard"));
const Form = lazy(() => import("./Pages/Form"));
function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>loading..</div>}>
          <Routes>
            <Route path="/userboard" element={<UserBoard />} />

            <Route path="/" element={<Form />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
