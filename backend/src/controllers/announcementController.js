const Announcement = require('../models/Announcement');
const getAnnouncements = async (req, res) => { try { res.json(await Announcement.find().sort({createdAt: -1})); } catch (e) { res.status(500).json({message: e.message}); } };
const createAnnouncement = async (req, res) => { try { res.status(201).json(await Announcement.create(req.body)); } catch (e) { res.status(500).json({message: e.message}); } };
const deleteAnnouncement = async (req, res) => { try { await Announcement.findByIdAndDelete(req.params.id); res.json({message: 'Deleted'}); } catch (e) { res.status(500).json({message: e.message}); } };
module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
