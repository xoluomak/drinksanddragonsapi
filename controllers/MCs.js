const bcrypt = require('bcrypt');
const Mc = require('../models/MCs');
const Event = require('../models/events');
const Logs = require('../models/logs');

exports.signup = (req, res, next) => {
    if (!req.body.password || !req.body.pseudo)
        return res.status(401).json({ message: 'Missing params.' });
    Mc.find({ pseudo: { $regex: req.body.pseudo, $options: 'i' } })
        .then(MCs => {
            if (MCs && MCs.length > 0) {
                res.status(401).json({ message: 'User already exists.' })
            }
        })
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
        const tmp = new Mc({
            pseudo: req.body.pseudo,
            password: hash,
            class: 'B',
            score: 0,
            created_at: new Date(),
            isAdmin: false,
            isViewer: !req.body.isViewer ? false : true,
        });
        tmp.save()
            .then(() => res.status(201).json({ message: 'MC created !' }))
            .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(401).json({ error }));
};

exports.login = (req, res, next) => {
    Mc.findOne({ pseudo: { $regex: req.body.pseudo, $options: 'i' } })
        .then(mc => {
            if (!mc) {
                return res.status(401).json({ error: 'MC not found.' });
            }
            bcrypt.compare(req.body.password, mc.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Wrong password.' });
                    }
                    res.status(200).json(mc);
                })
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(401).json({ error }));
};

exports.getAllMCs = (req, res, next) => {
    Mc.find()
      .then(MCs => res.status(200).json(MCs))
      .catch(error => res.status(401).json({ error }));
}

exports.getLogsByMC = (req, res, next) => {
    Event.find({ guests: req.params.id })
        .populate([{ path: 'guests', model: 'MC' }])
        .lean()
        .then(events => {
            Logs.find({ mcId: req.params.id })
                .populate([{ path: 'mcId', model: 'MC' }])
                .lean()
                .then(logs => res.status(200).json([...logs, ...events]))
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(401).json({ error }));
}

exports.deleteMC = (req, res, next) => {
    Mc.findOne({ _id: req.params.id }).then(
      (mc) => {
        if (!mc) {
          res.status(401).json({
            error: new Error('No such MC!')
          });
        }
        Mc.deleteOne({ _id: req.params.id }).then(
          () => {
            res.status(200).json({
              message: 'MC deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(401).json({
              error: error
            });
          }
        );
      }
    )
};

exports.updateMC = (req, res, next) => {
    Mc.findOne({ _id: req.params.id })
        .then(originalMc => {
            if (req.body.password) {
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {   
                        Mc.findOneAndUpdate({ _id: req.params.id }, { ...req.body, password: hash, _id: req.params.id }, { new: true }, (error, mc) => {
                            if (error) {
                                return res.status(401).json(error);
                            }
                            if (req.body.score) {
                                const difScore = req.body.score - originalMc.score;
                                const log = new Logs({
                                    mcId: req.params.id,
                                    score: difScore,
                                    date: new Date(),
                                });
                                log.save().then(
                                    () => {
                                        if (req.body.class && req.body.class !== originalMc.class) {
                                            const log = new Logs({
                                                mcId: req.params.id,
                                                class: req.body.class,
                                                date: new Date(),
                                            });
                                            log.save().then(
                                                () => {
                                                return res.status(201).json({
                                                    message: 'MC saved successfully!'
                                                });
                                                }
                                            ).catch(
                                                (error) => {
                                                return res.status(401).json({
                                                    error: error
                                                });
                                                }
                                            );
                                        } else {
                                            return res.status(201).json({
                                                message: 'MC saved successfully!'
                                            });
                                        }
                                    }
                                ).catch(
                                    (error) => {
                                    return res.status(401).json({
                                        error: error
                                    });
                                    }
                                );
                            } else if (req.body.class && req.body.class !== originalMc.class) {
                                const log = new Logs({
                                    mcId: req.params.id,
                                    class: req.body.class,
                                    date: new Date(),
                                });
                                log.save().then(
                                    () => {
                                    return res.status(201).json({
                                        message: 'MC saved successfully!'
                                    });
                                    }
                                ).catch(
                                    (error) => {
                                    return res.status(401).json({
                                        error: error
                                    });
                                    }
                                );
                            } else {
                                return res.status(201).json({
                                    message: 'MC saved successfully!'
                                });
                            }
                        });
                    })
            } else {
                Mc.findOneAndUpdate({ _id: req.params.id }, { ...req.body, _id: req.params.id }, { new: true }, (error, mc) => {
                    if (error) {
                        return res.status(401).json(error);
                    }
                    if (req.body.score) {
                        const difScore = req.body.score - originalMc.score;
                        const log = new Logs({
                            mcId: req.params.id,
                            score: difScore,
                            date: new Date(),
                        });
                        log.save().then(
                            () => {
                                if (req.body.class && req.body.class !== originalMc.class) {
                                    const log = new Logs({
                                        mcId: req.params.id,
                                        class: req.body.class,
                                        date: new Date(),
                                    });
                                    log.save().then(
                                        () => {
                                        return res.status(201).json({
                                            message: 'MC saved successfully!'
                                        });
                                        }
                                    ).catch(
                                        (error) => {
                                        return res.status(401).json({
                                            error: error
                                        });
                                        }
                                    );
                                } else {
                                    return res.status(201).json({
                                        message: 'MC saved successfully!'
                                    });
                                }
                            }
                        ).catch(
                            (error) => {
                            return res.status(401).json({
                                error: error
                            });
                            }
                        );
                    } else if (req.body.class && req.body.class !== originalMc.class) {
                        const log = new Logs({
                            mcId: req.params.id,
                            class: req.body.class,
                            date: new Date(),
                        });
                        log.save().then(
                            () => {
                            return res.status(201).json({
                                message: 'MC saved successfully!'
                            });
                            }
                        ).catch(
                            (error) => {
                            return res.status(401).json({
                                error: error
                            });
                            }
                        );
                    } else {
                        return res.status(201).json({
                            message: 'MC saved successfully!'
                        });
                    }
                });
            }
        })
        .catch(error => res.status(401).json({ error }));
}