const Connection = require('../models/Connection');

exports.markMet = async (req, res) => {
  console.log('la data es: ', req.body);
    const currentUserId = req.user._id; // This assumes the authenticated user's info is stored in req.user
    const metUserId = req.body.userId;
  
    try {
      // Check if the connection already exists
      const existingConnection = await Connection.findOne({
        $or: [
          { user1: currentUserId, user2: metUserId },
          { user1: metUserId, user2: currentUserId },
        ],
      });
  
      if (!existingConnection) {
        // Create a new connection
        console.log('no existe')
        const connection = new Connection({
          user1: currentUserId,
          user2: metUserId,
          metDate: new Date(),
        });
        await connection.save();
      } else { 
        console.log('existe')
      }
  
      res.redirect('/connections/all');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };

  exports.markUnmet = async (req, res) => {
    const currentUserId = req.user._id; // Assuming the authenticated user's info is stored in req.user
    const unmetUserId = req.body.userId;
  
    try {
      // Find and remove the connection
      const existingConnection = await Connection.findOneAndRemove({
        $or: [
          { user1: currentUserId, user2: unmetUserId },
          { user1: unmetUserId, user2: currentUserId },
        ],
      });
  
      if (existingConnection) {
        console.log('Connection removed');
      } else {
        console.log('Connection not found');
      }
  
      res.redirect('/connections/all');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  };
  