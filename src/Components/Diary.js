import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Alert, message } from "antd";
import "./Diary.css";
import "antd/dist/antd.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import Entries from "./Entries";
import Entry from "./Entry";
import { useAuth } from "../Contexts/AuthContext";
require("firebase/firestore");

function Diary() {
  const { Header, Content, Footer } = Layout;
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  console.log();
  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
      message.info("Logged Out Successfully");
    } catch {
      setError("Failed to Log Out");
      message.info(Error);
    }
  }

  return (
    <Router>
      <Layout>
        {/* /////////////////// */}
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <Link to="/">New Entry</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/entries">My Entries</Link>
            </Menu.Item>

            <Menu.Item
              style={{ float: "right" }}
              key="3"
              onClick={handleLogout}
            >
              <span>
                Log Out &ensp;<i class="fas fa-sign-out-alt"></i>
              </span>
            </Menu.Item>
          </Menu>
          <Alert
            message={<span>Currently logged in as {currentUser.email}</span>}
            type="success"
            showIcon
            closable
          />
        </Header>
        {/* /////////////////// */}
        <Content
          className="site-layout"
          style={{ padding: "0 50px", marginTop: 64 }}
        >
          <Switch>
            <Route path="/entries">
              <Entries />
            </Route>
            <Route path="/">
              <Entry />
            </Route>
          </Switch>
        </Content>

        {/* /////////////////// */}
        <Footer style={{ textAlign: "center" }}>Created by Lien Cheng</Footer>
        {/* /////////////////// */}
      </Layout>
    </Router>
  );
}

export default Diary;
