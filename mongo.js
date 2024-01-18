import { MongoClient } from 'mongodb';
const uri =
  'mongodb+srv://kanieloutis:s3s3sf28@cluster0.ek7xlxp.mongodb.net/sample_airbnb?retryWrites=true&w=majority';
export const mclient = new MongoClient(uri, { useNewUrlParser: true });
const database = mclient.db('bot_akshan');
const userRecords = database.collection('userRecords');

export async function checkForUserRecords(commandMsg, userMsg) {
  try {
    const database = mclient.db('bot_akshan');
    const userRecords = database.collection('userRecords');
    // document to look for
    const query = { userId: userMsg.author.id };
    const record = await userRecords.findOne(query);
    return record;
  } catch (error) {
    console.log(error);
  }
}

export async function createUserRecord(commandMsg, userMsg) {
  try {
    // create a document to insert
    const doc = {
      userId: userMsg.author.id,
      guilds: [userMsg.guildId],
      games: {
        habilidadv1:
          commandMsg.interaction.commandName === 'habilidadv1' ? 1 : 0,
        habilidadv2:
          commandMsg.interaction.commandName === 'habilidadv2' ? 1 : 0,
        campeon: commandMsg.interaction.commandName === 'campeon' ? 1 : 0,
        emojis: commandMsg.interaction.commandName === 'emojis' ? 1 : 0,
        frase: commandMsg.interaction.commandName === 'frase' ? 1 : 0,
      },
      wins: 1,
      tokens: 1,
      playSince: new Date(),
    };
    const result = await userRecords.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserRecord(commandMsg, userMsg) {
  try {
    // create a document to insert
    const filter = { userId: userMsg.author.id };

    const command = commandMsg.interaction.commandName;
    const game = `games.${command}`;
    const updateDoc = {
      $inc: {
        [game]: 1,
        wins: 1,
        tokens: 1,
      },
      $addToSet: { guilds: userMsg.guildId },
    };

    const result = await userRecords.updateOne(filter, updateDoc);
    console.log(
      `${result.matchedCount} document matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } catch (error) {
    console.log(error);
  }
}

export async function uptadeAllRecords() {
  await userRecords.updateMany(
    {},
    { $set: { tokens: 0 } },
    { upsert: false, multi: true }
  );
}

export async function updateUserTokens(userId) {
  try {
    const filter = { userId: userId };

    const updateDoc = {
      $inc: {
        tokens: -3,
      },
    };
    await userRecords.updateOne(filter, updateDoc);
  } catch (error) {
    console.log(error);
  }
  return;
}

export async function getUserStats(userId) {
  try {
    const query = { userId: userId };
    const stats = await userRecords.findOne(query);
    return stats;
  } catch (error) {
    console.log(error);
  }
}

export async function updateDatabase(commandMsg, userMsg) {
  const userRecord = await checkForUserRecords(commandMsg, userMsg);
  userRecord === null
    ? await createUserRecord(commandMsg, userMsg)
    : await updateUserRecord(commandMsg, userMsg);
}
