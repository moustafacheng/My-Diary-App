import React, { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb, BackTop } from "antd";
import "./Diary.css";
import "antd/dist/antd.css";
import { Empty, Card, Modal, Button, message } from "antd";
import { db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";
import { DeleteOutlined } from "@ant-design/icons";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
require("firebase/firestore");

function Entries() {
  const [diariesLoading, setDiariesLoading] = useState(false);
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]); // could use array.length to check if it's empty or not
  const [deleteModalRef, setDeleteModalRef] = useState();

  useEffect(() => {
    setDiariesLoading(true);
    db.collection("diaries")
      .where("creator", "==", currentUser.uid)
      .orderBy("date", "asc")
      .get()
      .then((x) => {
        //Get the users diary posts' documents and add each document's id into their fields
        const postID = x.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(postID);
      })
      .then(setDiariesLoading(false))
      .then(console.log(posts));
  }, []);

  // function showModal(e) {
  //   setModalVisibility(true);
  // }
  function hideModal() {
    setDeleteModalRef("");
  }
  function checkVisibility(id) {
    if (id === deleteModalRef) {
      return true;
    } else {
      return false;
    }
  }

  function deleteDiary() {
    db.collection("diaries")
      .doc(deleteModalRef)
      .delete()
      .then(() => {
        message.success("Deleted Successfully");
      })
      .then(setPosts(posts.filter((doc) => doc.id !== deleteModalRef)))
      .then(hideModal());
  }

  const diaryEntries = function () {
    //Return Empty Sign if there's no data/diary
    if (posts.length === 0) {
      return <Empty />;
    }

    //Return diaries as cards if diaries exist
    else if (posts.length > 0) {
      console.log(posts);
      // return postsShown
      return posts.map((doc) => (
        <div key={doc.id}>
          <Card
            type="inner"
            style={{
              marginBottom: "30px",
              maxHeight: "400px",
              overflowX: "break",
              overflowWrap: "break-word",
              maxWidth: "1200px",
              alignItems: "center",
            }}
            title={doc.date}
            extra={
              <Button
                type="danger"
                onClick={() => {
                  setDeleteModalRef(doc.id);
                }}
                id={doc.id}
              >
                <DeleteOutlined />
              </Button>
            }
          >
            {doc.input}
          </Card>
          <Modal
            title="Confirmation"
            visible={checkVisibility(doc.id)}
            onOk={deleteDiary}
            onCancel={hideModal}
            okText="Yes"
            cancelText="Cancel"
            id={doc.id}
          >
            <p>Are you sure you want to delete this entry?</p>
          </Modal>
        </div>
      ));
    }
  };

  return (
    <div>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>My Dairy</Breadcrumb.Item>
        <Breadcrumb.Item>My Entries</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 380 }}
      >
        {/* <Empty /> */}
        {diaryEntries()}
      </div>
      <BackTop />
    </div>
  );
}

export default Entries;
