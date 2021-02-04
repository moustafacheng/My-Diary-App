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

function getMoodIcon(mood) {
  switch (mood) {
    case "Happy":
    case "Relaxed":
      return "fa-smile-beam";
    case "Sad":
      return "fa-frown";
    case "Stressed":
      return "fa-dizzy";
    case "Mad":
      return "fa-angry";
    case "Meh":
      return "fa-meh";
    default:
      return "fa-smile-beam";
  }
}

function Entries() {
  const [diariesLoading, setDiariesLoading] = useState(false);
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]); // could use array.length to check if it's empty or not
  const [modal, setModal] = useState(null);

  useEffect(() => {
    getDiaries();
  }, []);

  async function getDiaries() {
    setDiariesLoading(true);

    const x = await db
      .collection("diaries")
      .where("creator", "==", currentUser.uid)
      .orderBy("date", "asc")
      .get();

    const postID = x.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setPosts(postID);
    setDiariesLoading(false);
    console.log({ posts });
  }

  function deleteDiary() {
    db.collection("diaries")
      .doc(modal)
      .delete()
      .then(() => {
        message.success("Deleted Successfully");
      })
      .then(setPosts(posts.filter((doc) => doc.id !== modal)))
      .then(() => {
        setModal(null);
      });
  }

  return (
    <div>
      <Modal
        title="Confirmation"
        visible={!!modal}
        onOk={deleteDiary}
        onCancel={() => setModal(null)}
        okText="Yes"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this entry?</p>
      </Modal>

      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>My Dairy</Breadcrumb.Item>
        <Breadcrumb.Item>My Entries</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 380 }}
      >
        {posts.length ? (
          posts.map((doc) => (
            <div key={doc.id}>
              <Card
                type="inner"
                style={{
                  marginBottom: 30,
                  maxHeight: 400,
                  overflowX: "break",
                  overflowWrap: "break-word",
                  maxWidth: 1200,
                  alignItems: "center",
                }}
                title={doc.date}
                extra={
                  <Button
                    type="danger"
                    onClick={() => {
                      setModal(doc.id);
                    }}
                    id={doc.id}
                  >
                    <DeleteOutlined />
                  </Button>
                }
              >
                <div>
                  <i
                    style={{ fontSize: 20 }}
                    class={`far ${getMoodIcon(doc.mood)}`}
                  >
                    &nbsp; {doc.mood}
                  </i>
                </div>
                <br />
                {doc.input}
              </Card>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>
      <BackTop />
    </div>
  );
}

export default Entries;
