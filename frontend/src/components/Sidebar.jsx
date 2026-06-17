import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    setToken,
    token,
  } = useAppContext();

  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out Succesfully");
  };

  // ✅ FIXED DELETE FUNCTION
  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirmDelete) return;

      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/chat/delete/${chatId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        // ✅ remove from UI
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));

        // ✅ clear selected chat if needed
        if (selectedChat?._id === chatId) {
          setSelectedChat(null);
        }

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen w-72 max-w-[80vw] p-5
      bg-white dark:bg-[#1a1a1a]
      border-r border-gray-200 dark:border-white/10
      transition-transform duration-300 ease-in-out
      max-md:fixed top-0 left-0 z-50
      ${!isMenuOpen ? "max-md:-translate-x-full" : "translate-x-0"}`}
    >
      {/* logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt=""
        className="w-full max-w-48"
      />

      {/* New Chat Button */}
      <button
        onClick={createNewChat}
        className="flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer"
      >
        <span className="mr-2 text-x1">+</span>New Chat
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
        <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" />
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search Conversations"
          className="text-xs placeholder:text-gray-400 outline-none"
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}

      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) => {
            if (!chat) return false;

            return chat.message?.[0]
              ? chat.message[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name?.toLowerCase().includes(search.toLowerCase());
          })
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
              className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15 rounded-md cursor-pointer flex justify-between group"
            >
              <div>
                <p className="truncate w-full">
                  {chat.message?.length > 0
                    ? chat.message[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A630]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>

              <img
                src={assets.bin_icon}
                onClick={(e) => deleteChat(e, chat._id)}
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                alt=""
              />
            </div>
          ))}
      </div>

      {/* Community */}
      <div
        onClick={() => {
          navigate("/community");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer"
      >
        <img src={assets.gallery_icon} className="w-4.5 not-dark:invert" />
        <p>Community Images</p>
      </div>

      {/* Credits */}
      <div
        onClick={() => {
          navigate("/credits");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer"
      >
        <img src={assets.diamond_icon} className="w-4.5 dark:invert" />
        <p>Credits : {user?.credits}</p>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <p>Dark Mode</p>
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </div>

      {/* User */}
      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <p className="flex-1">{user?.name || "Login"}</p>
        {user && (
          <img
            onClick={logout}
            src={assets.logout_icon}
            className="h-5 cursor-pointer"
          />
        )}
      </div>

      {/* Close */}
      <img
        src={assets.close_icon}
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden"
      />
    </div>
  );
};

export default Sidebar;