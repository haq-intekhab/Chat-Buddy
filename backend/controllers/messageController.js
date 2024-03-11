const Chat = require("../models/chatModel");
const User = require("../models/useModel");
const Message = require("../models/messageModel");

exports.sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json
      ({ error: "All fields are required" });
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(200).json({ message });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
    try {
        const chatId = req.params.chatId;

        const messages = await Message.find({ chat: chatId })
          .populate("sender", "name pic")
          .populate("chat");

        res.status(200).json({ messages });
    } catch (error) {
        return res.status(400).json
        ({ error: error.message });
    }
}
