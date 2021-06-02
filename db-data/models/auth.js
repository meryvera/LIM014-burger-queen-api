const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const authSchema = new Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 100,
  },
  password: {
    type: String,
    required: true,
  },
  timestamps: true,
});

// una función que realice comparaciones antes de realizar un guardado en la base de datos,
// necesario para poder encriptar (hashear) la contraseña antes de que se guarde
authSchema.pre('save', (next) => {
  // verifica que si algún campo distinto a la contraseña
  // ha sido modificado entonces no será necesario hashear la contraseña
  if (!this.isModified('password')) return next();
  // si por el contrasrio la contraseña si ha sido modificada o recién creada, se hasheará
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

// necesitamos una función que nos ayude a comparar la
// versión en texto plano que recibimos del cliente con la
// versión encyptada que tenemos guardada en la base de datos
authSchema.methods.comparePassword = (password, cb) => {
  // bcrypt.compartePassword(contraseñaenlaBD, contraseñaenelcliente, callback)
  bcrypt.comparePassword(password, this.password, (err, isMatch) => {
    // si ocurre un error retorna un cb
    if (err) return cb(err);
    // si las contraseña no coiciden, retorna un null en el argumento del error y isMatch
    if (!isMatch) return cb(null, isMatch);
    // si coiciden retornará un callback
    // con null en el apartado del error y this (el modelo user) como argumentos.
    return cb(null, this);
  });
};

module.exports = model('Auth', authSchema);
