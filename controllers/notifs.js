const Notif = require('../models/notifs');
const User = require('../models/users');
const Pet = require('../models/pets');
const cron = require('node-cron');

cron.schedule('0 * * * *', function() {
  const today = new Date();
  Pet.find()
  .populate([{ path: 'owner', model: 'User', select: 'deviceToken' }])
    .then(async pets => {
      pets.forEach(async pet => { 
        if (pet.enabled) {
          if ((pet.owner.deviceToken && pet.owner.deviceToken !== null && pet.owner.deviceToken.length > 0)) {
            const lastMeal = pet.lastMeal.length > 0 ? new Date(pet.lastMeal[0]) : new Date();
            var Difference_In_Time = today.getTime() - lastMeal.getTime();
            var daysDiff = Math.round(
              Difference_In_Time / (1000 * 3600 * 24),
            );
            if (!pet.lastMeal || pet.lastMeal.length === 0 || daysDiff >= pet.frequency) {
              const title = daysDiff > pet.frequency ?
              `Vous n'avez toujours pas nourri ${pet.name} !`
              : `Nourrir ${pet.name} !`
              const body = `Donnez ${pet.nbPrey} ${pet.foodType} à ${pet.name} aujourd'hui !`;
              try {
                await admin.messaging().sendMulticast({
                tokens: pet.owner.deviceToken,
                  notification: {
                    title,
                    body,
                    imageUrl: "https://cdn-icons-png.flaticon.com/512/616/616488.png",
                  },
                });                
              } catch (err) {
                console.log(err);
              }
            }
          }
        }
      });
    })
  .catch(error => console.log(error));
});
/*
cron.schedule('0 * * * *', function() {
  const today = new Date();
  Pet.find()
  .populate([{ path: 'owner', model: 'User', select: 'deviceToken' }])
    .then(async pets => {
      let totalNotifs = [];
      let total = 0;
      pets.forEach(async pet => {
        const lastMeal = pet.lastMeal.length > 0 ? new Date(pet.lastMeal[0]) : new Date();
        var Difference_In_Time = today.getTime() - lastMeal.getTime();
        var daysDiff = Math.round(
          Difference_In_Time / (1000 * 3600 * 24),
        );
        if (pet.notifTime === today.getUTCHours() + 1 && (pet.owner.deviceToken && pet.owner.deviceToken !== null && pet.owner.deviceToken.length > 0)) {
          if (pet.lastMeal.length === 0 || Math.round(daysDiff) >= pet.frequency) {
            const title = daysDiff > pet.frequency + 1 ?
            `Vous n'avez toujours pas nourri ${pet.name} !`
            : `Nourrir ${pet.name} !`
            const body = `Donnez ${pet.nbPrey} ${pet.foodType} à ${pet.name} aujourd'hui !`;
            totalNotifs.push({watering: false, pet, title, body, notifTime: pet.notifTime, UTCHours: today.getUTCHours()});
            total++;
            try {
              await admin.messaging().sendMulticast({
              tokens: pet.owner.deviceToken,
                notification: {
                  title,
                  body,
                  imageUrl: "https://cdn-icons-png.flaticon.com/512/616/616488.png",
                },
              });                
            } catch (err) {
              console.log(err);
            }
          }
        }
      });
      if (total > 0) {
        const notif = new Notif({
          createdAt: today,
          logs: totalNotifs,
          total: total,
        });
        notif.save().then(
          () => console.log('Notifs log saved successfully!')
        ).catch(
          (error) => console.log(error)
        );
      }
    })
  .catch(error => console.log(error));
});


cron.schedule('* * * * *', function() {
  Pet.find()
  .populate([{ path: 'owner', model: 'User', select: 'deviceToken' }])
    .then(async pets => {
      pets.forEach(async pet => {
        try {
          await admin.messaging().sendMulticast({
          tokens: pet.owner.deviceToken,
          notification: {
            title: 'test notif ' + pet.name,
            body: 'test body',
            imageUrl: "https://cdn-icons-png.flaticon.com/512/616/616488.png",
          },
          });
        } catch (err) {
          console.log(err);
        }
      })
    })
  .catch(error => console.log(error));
});
*/

exports.notifUsers = (req, res, next) => {
  console.log('notif users');
  const today = new Date();
  Pet.find()
  .populate([{ path: 'owner', model: 'User', select: '_id deviceToken' }])
    .then(async pets => {
      console.log('found pets');
      let total = 0;
      pets.forEach(async pet => {
        const dateDiff = today - (pet.lastMeal.length > 0 ? new Date(pet.lastMeal[0]) : new Date());
        const diffMins = Math.round((dateDiff / 60) / 1000);
        let hoursDiff = Math.round((diffMins - (diffMins % 60)) / 60);
        const daysDiff = hoursDiff / 24;
        if (pet.owner.deviceToken && pet.owner.deviceToken !== null && daysDiff > pet.frequency) {
          console.log('pet to notif : ', pet);
          const title = daysDiff > pet.frequency + 1 ?
          `Vous n'avez toujours pas nourri ${pet.name} !`
          : `Nourrir ${pet.name} !`
          const body = `Donnez ${pet.nbPrey} ${pet.foodType} à ${pet.name} aujourd'hui !`;
          total++;
          try {
            console.log('sending notif');
            await admin.messaging().sendMulticast({
            tokens: pet.owner.deviceToken,
            notification: {
              title,
              body,
              imageUrl: "https://cdn-icons-png.flaticon.com/512/616/616488.png",
            },
            });
          } catch (err) {
            console.log(err);
          }
        }
      });
    });
}

exports.createNotif = (req, res, next) => {
  const notif = new Notif({
    createdAt: new Date(),
    logs: req.body.logs,
    total: req.body.logs.length,
  });
  notif.save().then(
    () => {
      res.status(201).json({
        message: 'Notifs log saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(401).json({
        error: error
      });
    }
  );
};

exports.getAllNotifs = (req, res, next) => {
  Notif.find()
    .then(notifs => res.status(200).json(notifs))
    .catch(error => res.status(401).json({ error }));
}

exports.deleteNotif = (req, res, next) => {
  Notif.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Notif deleted !'}))
    .catch(error => res.status(401).json({ error }))
};

exports.sendNotificationToAll = (req, res, next) => {
  User.find()
    .then(async users => {
      let tokens = [];
      users.forEach(user => {
        if (user.deviceToken && user.deviceToken !== null) {
          user.deviceToken.forEach((token) => {
            tokens.push(token);                
          });
        }
      });
      try {
        const { title, body, imageUrl } = req.body;
        await admin.messaging().sendMulticast({
        tokens,
        notification: {
          title,
          body,
          imageUrl,
        },
        });
        res.status(200).json({ message: "Successfully sent notifications!" });
      } catch (err) {
        res
        .status(err.status || 500)
        .json({ message: err.message || "Something went wrong!" });
      }
        res.status(200).json(users);
      })
    .catch(error => res.status(401).json({ error }));
}

exports.sendNotificationToUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then(async user => {
      try {
        const { title, body, imageUrl } = req.body;
        await admin.messaging().sendMulticast({
        tokens: user.deviceToken,
        notification: {
          title,
          body,
          imageUrl,
        },
        });
        res.status(200).json({ message: "Successfully sent notifications!" });
      } catch (err) {
        res
        .status(err.status || 500)
        .json({ message: err.message || "Something went wrong!" });
      }
        res.status(200).json(users);
      })
    .catch(error => res.status(401).json({ error }));
}

exports.sendNotificationToUserToken = (req, res, next) => {
  try {
    const { title, body, imageUrl } = req.body;
    admin.messaging().sendMulticast({
    tokens: [req.params.token],
    notification: {
      title,
      body,
      imageUrl,
    },
    });
    res.status(200).json({ message: "Successfully sent notifications!" });
  } catch (err) {
    res
    .status(err.status || 500)
    .json({ message: err.message || "Something went wrong!" });
  }
}
