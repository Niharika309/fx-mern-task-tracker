const { body, validationResult } = require('express-validator');
const AuthService = require('../services/AuthService');

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;
      const result = await AuthService.register({ name, email, password, role });

      res.status(201).json(result);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: error.message });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      res.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = AuthController;

