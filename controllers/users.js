const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.signup = (req, res, next) => {
    if (!req.body.password || !req.body.email)
        return res.status(401).json({ message: 'Missing params.' });
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                admin: false,
            });
            user.save()
                .then(() => res.status(201).json({ message: 'User created !' }))
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(401).json({ error }));
  };

exports.updatePassword = (req, res, next) => {
    if (!req.body.password)
        return res.status(401).json({ message: 'Missing params.' });
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            User.updateOne({ _id: req.params.id }, { password: hash })
            .then(() => res.status(200).json({ message: 'User password updated' }))
            .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(401).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User not found.' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Wrong password.' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        email: user.email,
                        displayStyle: user.displayStyle !== undefined ? user.displayStyle : null,
                        admin: user.admin,
                        token: jwt.sign(
                            { userId: user._id },
                            'repminder_secret_token_2l|.*8pou]X-m32r',
                        )
                    });
                })
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(401).json({ error }));
};

exports.getAllUsers = (req, res, next) => {
    User.find()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(401).json({ error }));
}

exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
      .then(res.status(200).json({ message: 'User deleted!' }))
      .catch(error => res.status(401).json({ error }));
}

exports.assignDeviceToken = (req, res, next) => {
    User.findOne({ _id: req.params.id })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }
        _deviceToken = user.deviceToken;
        if (_deviceToken) {
            if (_deviceToken.includes(req.body.deviceToken)) {
                return res.status(200).json({ message: 'DeviceToken already added.' });
            }
            _deviceToken.push(req.body.deviceToken);
        } else {
            _deviceToken = [req.body.deviceToken];
        }
        User.updateOne({ _id: req.params.id }, { deviceToken: _deviceToken })
          .then(() => res.status(200).json({ message: 'Device token set' }))
          .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(401).json({ error }));
}

exports.updateUser = (req, res, next) => {
    User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'User updated' }))
      .catch(error => res.status(401).json({ error }));
}