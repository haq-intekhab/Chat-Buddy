const Chat = require("../models/chatModel");
const User = require("../models/useModel");
const Message = require("../models/messageModel");

exports.accessChat = async(req,res) => {
    try{
        const { userId } = req.body;

        if(!userId){
            console.log("UserId param not sent with request");
            return res.status(400).json({
                msg: "UserId param not sent with request"
            })
        }

        var isChat = await Chat.findOne({
            isGroupChat: false,
            $and: [
              { users: { $elemMatch: { $eq: req.user._id } } },
              { users: { $elemMatch: { $eq: userId } } },
            ],
          })
            .populate("users", "-password")
            .populate("latestMessage"),
          isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "-password",
          });

        if(isChat && isChat.lenght > 0){
            res.status(isChat[0]);
        }
        else{
            var chatData = {
              chatName: "sender",
              isGroupChat: false,
              users: [req.user._id,userId],
            };

            try{
                const creatChat = await Chat.create(chatData);
                const FullChat = await Chat.findById(creatChat._id).populate("users","-password")
                res.status(200).json(FullChat);
            }catch(err){
                console.log(err);
                res.status(400).json({
                    msg: "ERROR: Could not create chat",
                });
            }

        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            msg: "Something went wrong",
        });
    }
};

exports.fetchChats = async(req,res) => {
    try{
        const chats = await Chat.find({
            users: {$elemMatch: {$eq: req.user._id}},
        })
       .populate("users","-password")
       .populate("latestMessage")
       .populate("groupAdmin","-password")
       .sort({updatedAt: -1})
       .then(async(results) => {
            results = await User.populate(results,{
                path: "latestMessage.sender",
                select: "-password",
            });
            res.status(200).json(results);
       });

    } catch(err){
        console.log(err);
        res.status(400).json({
            msg: "data not found",
        });
    }   
};

exports.createGroupChat = async(req,res) => {
    // const { user,name } = req.body;
    // if(!user || !name){
    //     return res.status(400).json({
    //         message: "please fill all the fields"
    //     });
    // }

    var users = JSON.parse(req.body.users);

    if(users.lenght < 2){
        return res.status(400).json({
            message: "please select atleast two users"
        });
    }

    users.push(req.user._id);

    try{
        const chat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findById(chat._id)
        .populate("users","-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat);
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            msg: "GroupChat not created",
        });
    }
};

exports.renameGroup = async(req,res) => {
    try{
        const { chatId, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName,
            },
            {
                new: true,
            }
        ).populate("users","-password")
        .populate("groupAdmin","-password");

        if(!updatedChat){
            return res.status(400).json({
                msg: "Chat not found",
            });
        }
        else{
            res.status(200).json(updatedChat);
        }
    } catch(err){
        console.log(err);
        res.status(400).json({
            msg: "name not updated",
        });
    } 
};

exports.addToGroup = async(req,res) => {
    try{
        const { chatId, userId } = req.body;
        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {
                    users: userId,
                },
            },
            {
                new: true,
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password"); 
        
        res.status(200).json(added);
    } catch(err){
        console.log(err);
        res.status(400).json({
            msg: "user not added",
        });
    }
};

exports.removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          users: userId,
        },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(removed);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "user not removed",
    });
  }
};