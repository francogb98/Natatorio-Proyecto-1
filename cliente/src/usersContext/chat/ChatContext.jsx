import React, { Children, createContext, useReducer } from "react";
import { chatReducer } from "./chatReducer";

export const ChatContext = createContext();

const initialState = {
  uid: "",
  chatActivo: null, //uid al ususario qu ele quiero mandar mensajes
  usuarios: [],
  mensajes: [], //chat sellecionado
};

function ChatProvider({ children }) {
  const [chatState, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider
      value={{
        chatState,
        dispatch,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
