"use client";
import { useEffect, useState } from "react";
import Footer from "../components/footer/footer";
import Navbar from "../components/navbar/navbar";
import AdminPageContent from "./AdminPageContent";

enum PageState {
  DEFAULT,
  UNAUTHENTICATED,
  AUTHORIZED,
  UNAUTHORIZED,
}

export default function AdminPage() {
  const [pageState, setPageState] = useState<PageState>(PageState.DEFAULT);
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/get-role");
      if (!response.ok) {
        setPageState(PageState.UNAUTHENTICATED);
        return;
      }
      const myRoleData = await response.json();
      if (myRoleData["is_admin"]) {
        setPageState(PageState.AUTHORIZED);
        return;
      } else {
        setPageState(PageState.UNAUTHORIZED);
        return;
      }
    })();
  }, []);
  const actualContent = () => {
    switch (pageState) {
      case PageState.DEFAULT:
        return <>Figuring out who you are...</>;
      case PageState.UNAUTHENTICATED:
        return <>I don&apos;t know who you are</>;
      case PageState.AUTHORIZED:
        return <AdminPageContent></AdminPageContent>;
      case PageState.UNAUTHORIZED:
        return <>You can&apos;t see this</>;
    }
  };
  return (
    <>
      <Navbar></Navbar>
      {actualContent()}
      <Footer></Footer>
    </>
  );
}
