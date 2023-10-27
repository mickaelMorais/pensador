const { where, Op } = require("sequelize");
const Thoughts = require("../models/Thoughts");
const User = require("../models/User");
const { search } = require("../routes/thoughtsRouters");

module.exports = class ThoughtsController {
	static async showThoughts(req, res) {
		const thoughtData = await Thoughts.findAll({include:User})
		const thoughts = thoughtData.map((result) => result.get({plain:true}))
		return res.render("thoughts/home", {thoughts});
	}
	static async searchThoughts(req, res){
		const {search} = req.query
		const thoughtData = await Thoughts.findAll({include:User, where:{title:{[Op.like]: `${search}%`}}})
		const thoughts = thoughtData.map((result) => result.get({plain:true}))
		const qtd = thoughts.length
		return res.render("thoughts/home", {thoughts, search, qtd})
	}
	static async orderAscThoughts(req, res){
		const thoughtData = await Thoughts.findAll({order:[['createdAt','asc']], include:User})
		const thoughts = thoughtData.map((result) => result.get({plain:true}))
		return res.render("thoughts/home", {thoughts})
	}
	static async orderDescThoughts(req, res){
		const thoughtData = await Thoughts.findAll({order:[['createdAt','desc']], include:User})
		const thoughts = thoughtData.map((result) => result.get({plain:true}))
		return res.render("thoughts/home", {thoughts})
	}
	static async dashboard(req, res) {
		const userId = req.session.userId;
		const user = await User.findOne({
			where: { id: userId },
			include: Thoughts,
			plain:true
		});
		const thoughts = user.Thoughts.map((result) => result.dataValues)
		return res.render("thoughts/dashboard", {thoughts});
	}
	static async deleteThougth(req, res) {
		const {id} = req.body
		await Thoughts.destroy({where:{id:id}})
		return res.redirect("/thoughts/dashboard")
	}
	static async editThougth(req, res){
		const {id} = req.params
		const thoughts = await Thoughts.findOne({where:{id:id}})
		return res.render("thoughts/edit", thoughts.dataValues)
	}
	static async editThougthSave(req, res) {
		const {id} = req.params
		const {title} = req.body
		await Thoughts.update({title:title}, {where:{id:id}})
		req.flash("message", "pensamento atualizado com sucesso!");
		return res.redirect("/thoughts/dashboard")
	}
	static createThougth(req, res) {
		return res.render("thoughts/create");
	}
	static async createThougthSave(req, res) {
		const thoughts = {
			title: req.body.title,
			UserId: req.session.userId,
		};
		try {
			await Thoughts.create(thoughts);
			req.flash("message", "pensamento criado com sucesso!");
			req.session.save(() => {
				res.redirect("/thoughts/dashboard");
			});
		} catch (error) {
			console.error(error);
		}
	}
};
