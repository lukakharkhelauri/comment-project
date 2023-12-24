import "./App.css";

import React, { useState } from "react";
import Comment from "./components/Comment";
import Reply from "./components/Reply";
import data from "./data.json";

const App = () => {
  const [dataState, setDataState] = useState(data);
  const [inputValue, setInputValue] = useState("");
  const [replyToggle, setReplyToggle] = useState(
    Array(dataState.comments.length).fill(false)
  ); //Array() funqcia argumentis toli sigrdzis masivs sheqmnis da mis titoeul elements gadaaqcevs bulean value falsad

  const [replyToggleSecond, setReplyToggleSecond] = useState(
    Array(dataState.comments[1].replies.length).fill(false)
  );


  console.log(dataState.comments)


  const replyHandlerSecond = (index) => {
    setReplyToggleSecond((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleDelete = (commentIndex, replyIndex) => {
    setDataState((prevDataState) => {
      const updatedComments = [...prevDataState.comments];
  
      if (replyIndex !== undefined) {
        const updatedReplies = [...updatedComments[commentIndex].replies];
        updatedReplies.splice(replyIndex, 1);
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          replies: updatedReplies,
        };
      } else {
        updatedComments.splice(commentIndex, 1);
      }
  
      return {
        ...prevDataState,
        comments: updatedComments,
      };
    });
  };
  
  
  
  

  const replyHandler = (index) => {
    setReplyToggle((prevState) => {
      const updatedToggle = [...prevState];
      updatedToggle[index] = !updatedToggle[index];
      return updatedToggle;
    });
  };

  const addReply = (index, action) => {
    if (inputValue.trim() !== "") {
      const updatedComments = [...dataState.comments];
      const updatedReplies = [...updatedComments[index].replies];

      updatedReplies.push({
        id: updatedReplies.length + 1,
        content: inputValue,
        createdAt: `${new Date().getHours()}:${new Date().getMinutes()}`,
        score: 0,
        user: {
          image: {
            png: "/images/avatars/image-juliusomo.png",
          },
          username: "julisomo",
        },
        isCurrentUser: true,
        replyingTo: action ? updatedReplies[index-1].user.username : updatedComments[index].user.username
      });

      updatedComments[index] = {
        ...updatedComments[index],
        replies: updatedReplies,
      };

      setDataState({
        ...dataState,
        comments: updatedComments,
      });
      !action ? replyHandler(index) : replyHandlerSecond(0)

    } else {
      window.alert("Please Fill Input Field");
    }
  };

  const addComment = () => {
    if (inputValue.trim() !== "") {
      setDataState({
        ...dataState,
        comments: [
          ...dataState.comments,
          {
            id: dataState.comments.length + 1,
            content: inputValue,
            createdAt: `${new Date().getHours()}:${new Date().getMinutes()}`,
            score: 0,
            user: {
              image: {
                png: "/images/avatars/image-juliusomo.png",
              },
              username: "juliusomo",
            },
            replies: [],
          },
        ],
      });
    } else {
      window.alert("Fill The Comment Input Please.");
    }
  };

  const commentData = dataState.comments.map((item, index) => (
    <React.Fragment key={index}>
      <Comment
        item={item}
        itemIndex={index}
        data={dataState}
        replyHandler={() => replyHandler(index)}
        type={false}
        handleDelete={handleDelete}
        setDataState={setDataState}
      />
      {replyToggle[index] && (
        <Reply
          buttonTxt={"reply"}
          setInputValue={setInputValue}
          addReply={addReply}
          action={false}
          index={index}
        />
      )}
      {item.replies.length !== 0 ? (
        <div className="reply-div" key={index + 100}>
          {item.replies.map((reply, replyIndex) => (
            <>
              <Comment
                item={reply}
                itemIndex={index}
                key={replyIndex}
                setDataState={setDataState}
                replyIndex={replyIndex}
                data={dataState}
                type={true}
                replyHandler={()=>replyHandlerSecond(replyIndex)}
                handleDelete={handleDelete}
              />
              {replyToggleSecond[replyIndex] && reply.guestReply ? (
                <Reply
                  buttonTxt={'reply'}
                  setInputValue={setInputValue}
                  addReply={addReply}
                  action={true}
                  index={index}
                />
              ):''}
            </>
          ))}
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  ));

  return (
    <div>
      {commentData}
      <Reply
        buttonTxt={"send"}
        setInputValue={setInputValue}
        inputValue={inputValue}
        addComment={addComment}
      />
    </div>
  );
};

export default App;
