const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// definir el modelo de la base de datos
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    admin: {
      type: Boolean,
      required: true,
    },
  },
});

// una función que realice comparaciones antes de realizar un guardado en la base de datos,
// necesario para poder encriptar (hashear) la contraseña antes de que se guarde
userSchema.pre('save', function (next) {
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
userSchema.methods.comparePassword = (password, cb) => {
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

module.exports = model('User', userSchema);
