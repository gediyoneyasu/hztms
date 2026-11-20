const Route = require('../models/Route');
const getRoutes = async (req, res) => { try { res.json(await Route.find()); } catch (e) { res.status(500).json({message: e.message}); } };
const createRoute = async (req, res) => { try { res.status(201).json(await Route.create(req.body)); } catch (e) { res.status(500).json({message: e.message}); } };
const deleteRoute = async (req, res) => { try { await Route.findByIdAndDelete(req.params.id); res.json({message: 'Deleted'}); } catch (e) { res.status(500).json({message: e.message}); } };
module.exports = { getRoutes, createRoute, deleteRoute };
