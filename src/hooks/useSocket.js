import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  setConnectionStatus,
} from "../store/notification-slice";

// const SOCKET_URL = "https://e-commerce-backend-8j28.onrender.com";

const SOCKET_URL = "http://localhost:3000"; // Use this for local development

const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const connect = useCallback(() => {
    if (!isAuthenticated || !user) return;

    if (socketRef.current?.connected) {
      socketRef.current.disconnect();
    }

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: document.cookie.split("token=")[1]?.split(";")[0],
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      dispatch(setConnectionStatus(true));
    });

    socket.on("disconnect", () => {
      dispatch(setConnectionStatus(false));
    });

    socket.on("notification", (data) => {
      dispatch(addNotification(data));
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      dispatch(setConnectionStatus(false));
    });
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      connect();

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        dispatch(setConnectionStatus(false));
      }
    }
  }, [isAuthenticated, user, connect, dispatch]);

  return socketRef.current;
};

export default useSocket;
