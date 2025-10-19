const express = require('express');
const router = express.Router();
const Bibliotecario = require('../models/Bibliotecario');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const bibliotecario = await Bibliotecario.getByEmail(email);

    if (!bibliotecario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // ENCRIPTALO DESPUES BRO
    if (bibliotecario.contrasena !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // agrego despues JWT
    res.json({
      token: 'simple-token-' + bibliotecario.id, 
      bibliotecario: {
        id: bibliotecario.id,
        nombre: bibliotecario.nombre,
        email: bibliotecario.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;