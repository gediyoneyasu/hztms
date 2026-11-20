const Message = require('../models/Message');
const getMessages = async (req, res) => { try { res.json(await Message.find().sort({createdAt: -1})); } catch (e) { res.status(500).json({message: e.message}); } };
const createMessage = async (req, res) => { try { res.status(201).json(await Message.create(req.body)); } catch (e) { res.status(500).json({message: e.message}); } };
module.exports = { getMessages, createMessage };
