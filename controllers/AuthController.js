const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class AuthController {
	static async login(req, res) {
		return res.render("auth/login");
	}
	static async loginPost(req, res) {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email: email } });
		if (!user) {
			req.flash("message", "usuario não encontrado");
			return res.redirect("/login");
		}

		const passwordMatch = bcrypt.compareSync(password, user.password);
		console.log(passwordMatch)
		if (!passwordMatch) {
			req.flash("message", "senha invalida");
			return res.redirect("/login");
		}
		req.session.userId = user.id;
		req.flash("message", "login realizado com sucesso!");
		req.session.save(() => {
			res.redirect("/");
		});
	}
	static async register(req, res) {
		return res.render("auth/register");
	}
	static async registerPost(req, res) {
		const { name, email, password, confirmpassword } = req.body;

		// validação de email - Verificar se email já está cadastrado
		const checkeIfUserExist = await User.findOne({ where: { email: email } });
		if (checkeIfUserExist) {
			req.flash("message", "O e-mail já esta em uso");
			return res.render("auth/register");
		}
		// validação de senha - Verificar se as senhas são iguais
		if (password != confirmpassword) {
			req.flash("message", "As senhas não conferem, tente novamente");
			return res.render("auth/register");
		}
		// criptografar a senha do usuário
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);
		// criar objeto usuário para cadastro no banco
		const user = {
			name,
			email,
			password: hashedPassword,
		};
		// try Inserir usuário no banco e trabalhar com sessão
		try {
			const createdUser = await User.create(user);
			req.session.userId = createdUser;
			req.flash("message", "Cadastro realizado com sucesso!");
			req.session.save(() => {
				res.redirect("/");
			});
		} catch (error) {
			console.log(error);
		}
	}
	static async logout(req, res) {
		req.session.destroy();
		res.redirect("/login");
	}
};
