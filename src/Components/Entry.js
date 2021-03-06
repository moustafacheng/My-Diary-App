import React, { Children, useState } from "react";
import {
  Breadcrumb,
  DatePicker,
  Form,
  Input,
  Button,
  Select,
  BackTop,
  message,
} from "antd";
import "./Diary.css";
import "antd/dist/antd.css";
import { SendOutlined } from "@ant-design/icons";
import { useAuth } from "../Contexts/AuthContext";
import { db } from "../firebase";
import { FormProvider } from "antd/lib/form/context";
import "moment";

const { TextArea } = Input;
const { Option } = Select;
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

function Entry() {
  const { currentUser } = useAuth();
  const [form] = Form.useForm();

  async function handleSubmit(fieldsValue) {
    if (fieldsValue["date"] && fieldsValue["mood"] && fieldsValue["input"]) {
      const dateValue = fieldsValue["date"].format("YYYY-MM-DD");
      const moodValue = fieldsValue["mood"];
      const inputValue = fieldsValue["input"];

      await db.collection("diaries").add({
        creator: currentUser.uid,
        date: dateValue,
        mood: moodValue,
        input: inputValue,
      });

      message.success("Uploaded Successfully");
      form.resetFields();
    } else {
      if (!fieldsValue["date"]) {
        message.error("Date Missing");
      }
      if (!fieldsValue["mood"]) {
        message.error("Mood Missing");
      }
      if (!fieldsValue["input"]) {
        message.error("Input Missing");
      }
    }
  }

  return (
    <div>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>My Dairy</Breadcrumb.Item>
        <Breadcrumb.Item>New Entry</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 380 }}
      >
        {/* ///////////////ＦＯＲＭ ＨＥＲＥ///////////////// */}
        <FormProvider>
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            initialValues={{
              size: "large",
            }}
            onFinish={handleSubmit}
            form={form}
          >
            <Form.Item {...tailLayout} name="title">
              <span
                style={{
                  fontSize: "25px",
                  color: "#08c",
                  fontFamily: "Roboto",
                }}
              >
                Submit Your Diary
              </span>
            </Form.Item>
            <Form.Item name="date" label="Date" required>
              <DatePicker required />
            </Form.Item>
            <Form.Item name="mood" label="Mood" required>
              <Select style={{ width: 120 }}>
                <Option value="Happy">Happy</Option>
                <Option value="Sad">Sad</Option>
                <Option value="Stressed">Stressed</Option>
                <Option value="Relaxed">Relaxed</Option>
                <Option value="Mad">Mad</Option>
                <Option value="Meh">Meh</Option>
              </Select>
            </Form.Item>

            <Form.Item name="input" label="Input" required>
              <TextArea showCount maxLength={1000} rows={10} />
            </Form.Item>
            <Form.Item {...tailLayout} name="clearButton">
              <Button
                htmlType="button"
                onClick={() => {
                  form.resetFields();
                }}
              >
                Clear
              </Button>
            </Form.Item>
            <Form.Item {...tailLayout} name="SubmitButton">
              <Button htmlType="Submit" type="primary">
                <SendOutlined /> Save
              </Button>
            </Form.Item>
          </Form>
        </FormProvider>
        {/* //////////////////////////////// */}
      </div>
      <BackTop />
    </div>
  );
}

export default Entry;
